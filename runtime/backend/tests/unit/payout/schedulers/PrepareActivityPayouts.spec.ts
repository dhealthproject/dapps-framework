/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";

// internal dependencies
import { MockModel } from "../../../mocks/global";

// common scope
import { StateService } from "../../../../src/common/services/StateService";
import { QueryService } from "../../../../src/common/services/QueryService";

// processor scope
import { ActivityDocument, ActivityModel, ActivityQuery } from "../../../../src/processor/models/ActivitySchema";
import { ProcessingState } from "../../../../src/processor/models/ProcessingStatusDTO";

// payout scope
import { PayoutState } from "../../../../src/payout/models/PayoutStatusDTO";
import { PayoutDocument, PayoutQuery } from "../../../../src/payout/models/PayoutSchema";
import { PayoutsService } from "../../../../src/payout/services/PayoutsService";
import { SignerService } from "../../../../src/payout/services/SignerService";
import { PrepareActivityPayouts } from "../../../../src/payout/schedulers/ActivityPayouts/PrepareActivityPayouts";

const activityMocks = [
  {
    slug: "fake-slug1",
    address: "fake-owner1",
    createdAt: new Date(),
    activityData: {
      sport: "Walk",
      calories: 1,
      distance: 2,
      elevation: 3,
      elapsedTime: 4,
      kilojoules: 5,
    }
  } as ActivityDocument,
  {
    slug: "fake-slug2",
    address: "fake-owner2",
    createdAt: new Date(),
    activityData: {
      sport: "Walk",
      calories: 5,
      distance: 4,
      elevation: 3,
      elapsedTime: 2,
      kilojoules: 1,
    }
  } as ActivityDocument,
];

describe("payout/PrepareActivityPayouts", () => {
  let command: PrepareActivityPayouts;
  let configService: ConfigService;
  let stateService: StateService;
  let queryService: QueryService<ActivityDocument, ActivityModel>;
  let payoutsService: PayoutsService;
  let signerService: SignerService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrepareActivityPayouts,
        ConfigService,
        StateService,
        QueryService,
        PayoutsService,
        SignerService,
        Logger,
        {
          provide: getModelToken("Payout"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Activity"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
      ]
    }).compile();

    command = module.get<PrepareActivityPayouts>(PrepareActivityPayouts);
    configService = module.get<ConfigService>(ConfigService);
    stateService = module.get<StateService>(StateService);
    queryService = module.get<QueryService<ActivityDocument, ActivityModel>>(QueryService);
    payoutsService = module.get<PayoutsService>(PayoutsService);
    signerService = module.get<SignerService>(SignerService);
    logger = module.get<Logger>(Logger);
  });

  it("should be defined", () => {
    expect(command).toBeDefined();
  });

  describe("get command()", () => {
    it("should return correct result", () => {
      // act
      const result = (command as any).command;

      // assert
      expect(result).toBe("PrepareActivityPayouts");
    });
  });

  describe("get signature()", () => {
    it("should return correct result", () => {
      // act
      const result = (command as any).signature;

      // assert
      expect(result).toBe("PrepareActivityPayouts");
    });
  });

  describe("get collection()", () => {
    it("should return correct result", () => {
      // act
      const result = (command as any).collection; 

      // assert
      expect(result).toBe("activities");
    });
  });

  describe("fetchSubjects()", () => {
    let findMock = jest.fn().mockReturnValue({ data: [] });
    beforeEach(() => {
      (command as any).queryService = {
        find: findMock,
      };

      findMock.mockClear();
    });

    it("should query activities by processing- and payout state", async () => {
      // act
      await (command as any).fetchSubjects();

      // assert
      expect(findMock).toHaveBeenCalledTimes(1);
      expect(findMock).toHaveBeenCalledWith(new ActivityQuery(
        {
          processingState: ProcessingState.Processed,
          payoutState: PayoutState.Not_Started,
        } as ActivityDocument,
        {
          pageNumber: 1,
          pageSize: 10,
          sort: "createdAt",
          order: "asc",
        },
      ), (command as any).model);
    });
  });

  describe("getAssetIdentifier()", () => {
    it("should use mosaic identifier from EARN asset configuration", () => {
      // prepare
      const expectedId = "fake-identifier";
      (command as any).earnAsset = { mosaicId: expectedId };

      // act
      const result = (command as any).getAssetIdentifier();

      // assert
      expect(result).toBe(expectedId);
    });
  });

  describe("getAssetAmount()", () => {
    let activityMock = {
      slug: "fake-slug",
      address: "fake-owner",
      activityData: {
        sport: "Walk",
        calories: 1,
        distance: 2,
        elevation: 3,
        elapsedTime: 4,
        kilojoules: 5,
      }
    } as ActivityDocument;

    beforeEach(() => {
      (command as any).earnAsset = {
        mosaicId: "fake-identifier",
        divisibility: 2,
      };
    });

    it("should return empty given no time elapsed", () => {
      // act
      const result = (command as any).getAssetAmount({
        ...activityMock,
        activityData: {
          ...activityMock.activityData,
          elapsedTime: 0, // <-- T cannot be 0
        },
      });

      // assert
      expect(result).toBe(0);
    });

    it("should use correct formula given sport type", () => {
      // act
      const resultWalk = (command as any).getAssetAmount(activityMock);
      const resultRun = (command as any).getAssetAmount({
        ...activityMock,
        activityData: {
          ...activityMock.activityData,
          sport: "Run", // <-- forces run type
        },
      });

      // assert
      expect(resultWalk).not.toBe(0);
      expect(resultRun).not.toBe(0);
      expect(resultWalk).not.toBe(resultRun);
    });

    it("should convert to a correct absolute amount", () => {
      // prepare
      (command as any).earnAsset = {
        mosaicId: "fake-identifier",
        divisibility: 3, // <-- forcing divisibility 3
      };
      // note that this uses the Walk formula
      const expectedValue = Math.round(Math.floor(
        (((2+5)/4)*(3+5+1)*1.2*100) * 1000 // <-- 3 zeros
      ));

      // act
      const result = (command as any).getAssetAmount(activityMock);

      // assert
      expect(result).toBe(expectedValue);
    });

    it("should accept change of divisibility in asset configuration", () => {
      // prepare
      (command as any).earnAsset = {
        mosaicId: "fake-identifier",
        divisibility: 6, // <-- forcing divisibility 6
      };
      // note that this uses the Walk formula
      const expectedValue = Math.round(Math.floor(
        (((2+5)/4)*(3+5+1)*1.2*100) * 1000000 // <-- 6 zeros
      ));

      // act
      const result = (command as any).getAssetAmount(activityMock);

      // assert
      expect(result).toBe(expectedValue);
    });

    it("should always round to correct integer value for amount", () => {
      // prepare
      
      const walkFormula = Math.round(Math.floor(
        (((2+5)/4)*(3+5+1)*1.2*100) * 100 // <-- 2 zeros (L172)
      ));
      const otherFormula = Math.round(Math.floor(
        (((4+1)/2)*(3+1+5)*1.2*100) * 100 // <-- 2 zeros (L172)
      ));

      // act
      const result1 = (command as any).getAssetAmount(activityMocks[0]);
      const result2 = (command as any).getAssetAmount(activityMocks[1]);

      // assert
      expect(result1).toBe(walkFormula);
      expect(result2).toBe(otherFormula);
    });
  });

  describe("updatePayoutSubject()", () => {
    const queryCreateOrUpdateMock = jest.fn();
    beforeEach(() => {
      (command as any).queryService = {
        createOrUpdate: queryCreateOrUpdateMock,
      };

      queryCreateOrUpdateMock.mockClear();
    });

    it("should filter subjects by slug and set payout state", async () => {
      // prepare
      const expectedSlug = "fake-payout-subject-slug";
      const expectedData = { payoutState: PayoutState.Prepared };

      // act
      (command as any).updatePayoutSubject(
        { slug: expectedSlug } as ActivityDocument,
        expectedData,
      );

      // assert
      expect(queryCreateOrUpdateMock).toHaveBeenCalledTimes(1);
      expect(queryCreateOrUpdateMock).toHaveBeenCalledWith(
        new ActivityQuery(
          { slug: expectedSlug } as ActivityDocument,
        ),
        (command as any).model,
        expectedData
      );
    });
  });

  describe("execute()", () => {
    const mockTotalNumberPrepared = 100;
    const mockPublicKey = "fake-signer-public-key";
    const mockSignedPayload = "fake-serialized-signed-transaction";
    const mockTransactionHash = "fake-transaction-hash";
    const updatePayoutSubjectMock = jest.fn();
    const fetchSubjectsEmptyMock = jest.fn().mockReturnValue(Promise.resolve([]));
    const fetchSubjectsNonEmptyMock = jest.fn().mockReturnValue(Promise.resolve([
      {} as ActivityDocument,
    ]));
    const fetchSubjectsActualMock = jest.fn().mockReturnValue(
      Promise.resolve(activityMocks),
    );
    const payoutsCreateOrUpdateMock = jest.fn();
    const signerGetSignerPublicKeyMock = jest.fn().mockReturnValue(
      mockPublicKey,
    );
    const signerSignTransactionMock = jest.fn().mockReturnValue({
      payload: mockSignedPayload,
      hash: mockTransactionHash,
    });
    beforeEach(() => {
      (command as any).earnAsset = {
        mosaicId: "fake-identifier",
        divisibility: 2,
      };
      (command as any).logger = logger;
      (command as any).state = {
        data: { totalNumberPrepared: mockTotalNumberPrepared },
      };
      (command as any).fetchSubjects = fetchSubjectsEmptyMock; // <-- empty
      (command as any).updatePayoutSubject = updatePayoutSubjectMock;
      (command as any).payoutsService = {
        createOrUpdate: payoutsCreateOrUpdateMock
      };
      (command as any).signerService = {
        getSignerPublicKey: signerGetSignerPublicKeyMock,
        signTransaction: signerSignTransactionMock,
      };

      fetchSubjectsEmptyMock.mockClear();
      fetchSubjectsNonEmptyMock.mockClear();
      fetchSubjectsActualMock.mockClear();
      updatePayoutSubjectMock.mockClear();
      payoutsCreateOrUpdateMock.mockClear();
      signerGetSignerPublicKeyMock.mockClear();
      signerSignTransactionMock.mockClear();
    });

    it("should initialize with correct state", async () => {
      // act
      await command.execute({
        dryRun: true,
      });

      // assert
      expect((command as any).totalNumberPrepared).toBe(100);
    });

    it("should call child class implementation to fetch subjects", async () => {
      // act
      await command.execute({
        dryRun: true,
      });

      // assert
      expect(fetchSubjectsEmptyMock).toHaveBeenCalledTimes(1);
    });

    it("should log correctly given debug mode and non-quiet mode", async () => {
      // prepare
      const debugLogMock = jest.spyOn((command as any), "debugLog");

      // act
      await command.execute({
        dryRun: true,
        debug: true,
      });

      // assert
      expect(debugLogMock).toHaveBeenCalledTimes(1);
      expect(debugLogMock).toHaveBeenCalledWith(
        `No subjects discovered in ${(command as any).collection}`
      );
    });

    it("should sign payout per subject and update documents and state", async () => {
      // prepare
      (command as any).fetchSubjects = fetchSubjectsActualMock; // <-- non-empty

      // act
      await command.execute({
        dryRun: true,
        debug: true,
      });

      // assert
      expect(fetchSubjectsActualMock).toHaveBeenCalledTimes(1);
      expect(payoutsCreateOrUpdateMock).toHaveBeenCalledTimes(2); // 2 subjects
      expect(signerGetSignerPublicKeyMock).toHaveBeenCalledTimes(2); // 2 payouts
      expect(signerSignTransactionMock).toHaveBeenCalledTimes(2); // 2 payouts
      expect(updatePayoutSubjectMock).toHaveBeenCalledTimes(2); // 2 subjects
      expect((command as any).totalNumberPrepared).toBe(
        mockTotalNumberPrepared + 2, // 2 payouts
      );
    });

    it("should update payout document state after signature", async() => {
      // prepare
      (command as any).fetchSubjects = fetchSubjectsActualMock; // <-- non-empty

      // act
      await command.execute({
        dryRun: true,
        debug: true,
      });

      // assert
      expect(payoutsCreateOrUpdateMock).toHaveBeenCalledTimes(2); // 2 payouts
      expect(payoutsCreateOrUpdateMock).toHaveBeenNthCalledWith(1,
        new PayoutQuery({
          subjectSlug: activityMocks[0].slug,
          subjectCollection: "activities",
          userAddress: activityMocks[0].address,
        } as PayoutDocument),
        {
          payoutState: PayoutState.Prepared,
          signedBytes: mockSignedPayload,
          transactionHash: mockTransactionHash,
        },
      );
      expect(payoutsCreateOrUpdateMock).toHaveBeenNthCalledWith(2,
        new PayoutQuery({
          subjectSlug: activityMocks[1].slug,
          subjectCollection: "activities",
          userAddress: activityMocks[1].address,
        } as PayoutDocument),
        {
          payoutState: PayoutState.Prepared,
          signedBytes: mockSignedPayload,
          transactionHash: mockTransactionHash,
        },
      );
    });
  });
});