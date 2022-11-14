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
import { TransactionMapping } from "@dhealth/sdk";

// internal dependencies
import { MockModel } from "../../../mocks/global";

// common scope
import { StateService } from "../../../../src/common/services/StateService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { NetworkService } from "../../../../src/common/services/NetworkService";

// processor scope
import { ActivityDocument, ActivityModel, ActivityQuery } from "../../../../src/processor/models/ActivitySchema";

// payout scope
import { PayoutState } from "../../../../src/payout/models/PayoutStatusDTO";
import { Payout, PayoutDocument, PayoutQuery } from "../../../../src/payout/models/PayoutSchema";
import { PayoutsService } from "../../../../src/payout/services/PayoutsService";
import { SignerService } from "../../../../src/payout/services/SignerService";
import { BroadcastActivityPayouts } from "../../../../src/payout/schedulers/ActivityPayouts/BroadcastActivityPayouts";

const payoutMocks = [
  {
    subjectSlug: "fake-subject1",
    subjectCollection: "activities",
    userAddress: "fake-owner1",
    signedBytes: "fake-signed-bytes1",
    transactionHash: "fake-hash1",
  } as PayoutDocument,
  {
    subjectSlug: "fake-subject2",
    subjectCollection: "activities",
    userAddress: "fake-owner2",
    signedBytes: "fake-signed-bytes2",
    transactionHash: "fake-hash2",
  } as PayoutDocument,
  {
    subjectSlug: "fake-subject3",
    subjectCollection: "activities",
    userAddress: "fake-owner3",
    signedBytes: "fake-signed-bytes3",
    transactionHash: "fake-hash3",
  } as PayoutDocument,
  {
    subjectSlug: "fake-subject4",
    subjectCollection: "activities",
    userAddress: "fake-owner4",
    signedBytes: "fake-signed-bytes4",
    transactionHash: "fake-hash4",
  } as PayoutDocument,
];

describe("payout/BroadcastActivityPayouts", () => {
  let command: BroadcastActivityPayouts;
  let configService: ConfigService;
  let stateService: StateService;
  let networkService: NetworkService;
  let queryService: QueryService<ActivityDocument, ActivityModel>;
  let payoutsService: PayoutsService;
  let signerService: SignerService;
  let logger: Logger;
  let mockDate: Date;

  beforeEach(async () => {
    // use fake dates
    mockDate = new Date(Date.UTC(2022, 1, 1)); // UTC 1643673600000
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BroadcastActivityPayouts,
        ConfigService,
        StateService,
        QueryService,
        NetworkService,
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

    command = module.get<BroadcastActivityPayouts>(BroadcastActivityPayouts);
    configService = module.get<ConfigService>(ConfigService);
    stateService = module.get<StateService>(StateService);
    networkService = module.get<NetworkService>(NetworkService);
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
      expect(result).toBe("BroadcastActivityPayouts");
    });
  });

  describe("get signature()", () => {
    it("should return correct result", () => {
      // act
      const result = (command as any).signature;

      // assert
      expect(result).toBe("BroadcastActivityPayouts");
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
      (command as any).payoutsService = {
        find: findMock,
      };

      findMock.mockClear();
    });

    it("should query payouts by payout state and collection", async () => {
      // act
      await (command as any).fetchSubjects(3);

      // assert
      expect(findMock).toHaveBeenCalledTimes(1);
      expect(findMock).toHaveBeenCalledWith(new PayoutQuery(
        {
          payoutState: PayoutState.Prepared,
          subjectCollection: (command as any).collection
        } as PayoutDocument,
        {
          pageNumber: 1,
          pageSize: 3,
          sort: "createdAt",
          order: "asc",
        },
      ));
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
      const expectedData = { payoutState: PayoutState.Broadcast };

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
    let debugLogMock: any;
    const fetchSubjectsEmptyMock = jest.fn().mockReturnValue(Promise.resolve([]));
    const fetchSubjectsNonEmptyMock = jest.fn().mockReturnValue(Promise.resolve([
      {} as PayoutDocument,
    ]));
    const fetchSubjectsActualMock = jest.fn().mockReturnValue(
      Promise.resolve(payoutMocks),
    );
    const updatePayoutSubjectMock = jest.fn();
    const payoutsCreateOrUpdateMock = jest.fn();
    const networkDelegatePromisesMock = jest.fn().mockReturnValue(
      Promise.resolve(),
    );
    const transactionAnnounceToPromiseMock = jest.fn();
    const transactionAnnounceMock = jest.fn().mockReturnValue({
      toPromise: transactionAnnounceToPromiseMock,
    });
    const serializeMock = jest.fn();
    const countMock = jest.fn().mockReturnValue(4); // <-- 4 payouts in payoutMocks
    const transactionMock = {
      serialize: serializeMock,
      transactionInfo: {
        hash: "fake-hash1",
      },
      signer: {
        publicKey: "fake-signer-publicKey1"
      },
      type: "fake-type",
      networkType: "fake-network",
    };
    beforeEach(() => {
      (command as any).earnAsset = {
        mosaicId: "fake-identifier",
        divisibility: 2,
      };
      (command as any).logger = logger;
      (command as any).state = {
        data: { lastExecutedAt: new Date().valueOf() },
      };
      (command as any).fetchSubjects = fetchSubjectsEmptyMock; // <-- empty
      (command as any).updatePayoutSubject = updatePayoutSubjectMock;
      (command as any).payoutsService = {
        createOrUpdate: payoutsCreateOrUpdateMock,
        count: countMock,
      };
      (command as any).networkService = {
        delegatePromises: networkDelegatePromisesMock,
        transactionRepository: {
          announce: transactionAnnounceMock,
        }
      };

      fetchSubjectsEmptyMock.mockClear();
      fetchSubjectsNonEmptyMock.mockClear();
      fetchSubjectsActualMock.mockClear();
      payoutsCreateOrUpdateMock.mockClear();
      updatePayoutSubjectMock.mockClear();
      networkDelegatePromisesMock.mockClear();
      serializeMock.mockClear();
      countMock.mockClear();

      debugLogMock = jest.spyOn((command as any), "debugLog");
    });

    it("should initialize with correct state", async () => {
      // act
      await command.execute({
        maxCount: 1,
        dryRun: true,
      });

      // assert
      expect((command as any).lastExecutedAt).toBe(mockDate.valueOf());
    });

    it("should call child class implementation to fetch subjects", async () => {
      // act
      await command.execute({
        maxCount: 2,
        dryRun: true,
      });

      // assert
      expect(fetchSubjectsEmptyMock).toHaveBeenCalledTimes(1);
    });

    it("should log correctly given debug mode and non-quiet mode", async () => {
      // act
      await command.execute({
        maxCount: 1,
        dryRun: true,
        debug: true,
      });

      // assert
      expect(debugLogMock).toHaveBeenCalledTimes(2);
      expect(debugLogMock).toHaveBeenNthCalledWith(1,
        `[DRY-RUN] The dry-run mode is enabled for this command`
      );
      expect(debugLogMock).toHaveBeenNthCalledWith(2,
        `[DRY-RUN] No broadcast-able transactions found`
      );
    });

    it("should always use dry-run mode given globalDryRun", async () => {
      // prepare
      (command as any).globalDryRun = true;

      // act
      await command.execute({
        maxCount: 1,
        dryRun: false, // <-- option-level dry-run should not precede global
        debug: true,
      });

      // assert
      expect(debugLogMock).toHaveBeenCalledTimes(2);
      expect(debugLogMock).toHaveBeenNthCalledWith(1,
        `[DRY-RUN] The dry-run mode is enabled for this command`
      );
      expect(debugLogMock).toHaveBeenNthCalledWith(2,
        `[DRY-RUN] No broadcast-able transactions found`
      );
    });

    it("should use dry-run mode given dryRun parameter", async () => {
      // prepare
      (command as any).globalDryRun = false; // non-global

      // act
      await command.execute({
        maxCount: 1,
        dryRun: true, // <-- option-level dry-run
        debug: true,
      });

      // assert
      expect(debugLogMock).toHaveBeenCalledTimes(2);
      expect(debugLogMock).toHaveBeenNthCalledWith(1,
        `[DRY-RUN] The dry-run mode is enabled for this command`
      );
      expect(debugLogMock).toHaveBeenNthCalledWith(2,
        `[DRY-RUN] No broadcast-able transactions found`
      );
    });

    it("should use production mode correctly and differentiate", async () => {
      // prepare
      (command as any).globalDryRun = false; // non-global

      // act
      await command.execute({
        maxCount: 1,
        dryRun: false, // <-- production
        debug: true,
      });

      // assert
      expect(debugLogMock).toHaveBeenCalledTimes(1);
      expect(debugLogMock).toHaveBeenNthCalledWith(1,
        `[PROD] No broadcast-able transactions found`
      );
    });

    it("should re-build specialized transaction given signed payload", async () => {
      // prepare
      (command as any).fetchSubjects = fetchSubjectsActualMock; // <-- non-empty
      const createFromPayloadMock = jest.spyOn(TransactionMapping, "createFromPayload")
        .mockReturnValue(transactionMock as any);
      const expectedCount = 1;

      // act
      await command.execute({
        maxCount: expectedCount,
        dryRun: true, // <-- dry-run
        debug: true,
      });

      // assert
      expect(countMock).toHaveBeenCalledTimes(1);
      expect(debugLogMock).toHaveBeenCalledTimes(3);
      expect((command as any).transactions).toBeDefined();
      expect(Object.keys((command as any).transactions).length).toBe(1); // <-- maxCount: 1
      expect(debugLogMock).toHaveBeenNthCalledWith(1,
        `[DRY-RUN] The dry-run mode is enabled for this command`
      );
      expect(debugLogMock).toHaveBeenNthCalledWith(2,
        `[DRY-RUN] Found ${expectedCount} broadcast-able transaction(s) ` +
        `in queue of ${payoutMocks.length} eligible payouts.`
      );
      expect(debugLogMock).toHaveBeenNthCalledWith(3,
        `[DRY-RUN] Now broadcasting ${expectedCount} transaction(s)`
      );
      expect(createFromPayloadMock).toHaveBeenCalledTimes(expectedCount);
    });

    it("should not broadcast transaction given dry-run mode", async () => {
      // act
      await command.execute({
        maxCount: 1,
        dryRun: true, // <-- dry-run
        debug: true,
      });

      // assert
      expect(networkDelegatePromisesMock).not.toHaveBeenCalled();
    });

    it("should not update payout documents given dry-run mode", async () => {
      // act
      await command.execute({
        maxCount: 1,
        dryRun: true, // <-- dry-run
        debug: true,
      });

      // assert
      expect(payoutsCreateOrUpdateMock).not.toHaveBeenCalled();
    });

    it("should broadcast and update state given production mode", async () => {
      // prepare
      (command as any).globalDryRun = false;
      const payoutFetchSubjectMock = jest.spyOn(Payout, "fetchSubject").mockReturnValue({
        slug: "fake-payout-subject-slug",
      } as any);
      (command as any).fetchSubjects = fetchSubjectsActualMock; // <-- non-empty
      const expectedCount = 2;

      // act
      await command.execute({
        maxCount: expectedCount,
        dryRun: false, // <-- production
        debug: true,
      });

      // assert
      expect(networkDelegatePromisesMock).toHaveBeenCalledTimes(1);
      expect(payoutsCreateOrUpdateMock).toHaveBeenCalledTimes(2); // 2 payouts
      expect(payoutFetchSubjectMock).toHaveBeenCalledTimes(2); // 2 subjects
      expect(updatePayoutSubjectMock).toHaveBeenCalledTimes(2); // 2 subjects
      expect(payoutsCreateOrUpdateMock).toHaveBeenNthCalledWith(1,
        new PayoutQuery({
          userAddress: payoutMocks[0].userAddress,
          subjectSlug: payoutMocks[0].subjectSlug,
          subjectCollection: "activities",
        } as PayoutDocument),
        {
          payoutState: PayoutState.Broadcast,
        },
      );
      expect(payoutsCreateOrUpdateMock).toHaveBeenNthCalledWith(2,
        new PayoutQuery({
          userAddress: payoutMocks[1].userAddress,
          subjectSlug: payoutMocks[1].subjectSlug,
          subjectCollection: "activities",
        } as PayoutDocument),
        {
          payoutState: PayoutState.Broadcast,
        },
      );
      expect(transactionAnnounceToPromiseMock).toHaveBeenCalledTimes(2);
      expect(updatePayoutSubjectMock).toHaveBeenNthCalledWith(1, 
        { slug: "fake-payout-subject-slug"},
        { payoutState: PayoutState.Broadcast },
      );
      expect(updatePayoutSubjectMock).toHaveBeenNthCalledWith(2, 
        { slug: "fake-payout-subject-slug"},
        { payoutState: PayoutState.Broadcast },
      );
    });
  });
});
