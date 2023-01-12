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
import { EventEmitter2 } from "@nestjs/event-emitter";

// internal dependencies
import { MockModel } from "../../../../mocks/global";

// common scope
import { StateService } from "../../../../../src/common/services/StateService";
import { QueryService } from "../../../../../src/common/services/QueryService";
import { LogService } from "../../../../../src/common/services/LogService";
import { AccountDocument, AccountModel, AccountQuery } from "../../../../../src/common/models/AccountSchema";

// discovery scope
import { AssetsService } from "../../../../../src/discovery/services/AssetsService";

// payout scope
import { PayoutState } from "../../../../../src/payout/models/PayoutStatusDTO";
import { PayoutDocument, PayoutQuery } from "../../../../../src/payout/models/PayoutSchema";
import { PayoutsService } from "../../../../../src/payout/services/PayoutsService";
import { SignerService } from "../../../../../src/payout/services/SignerService";
import { MathService } from "../../../../../src/payout/services/MathService";
import { AccountSessionsService } from "../../../../../src/common/services/AccountSessionsService";
import { PayoutPreparationStateData } from "../../../../../src/payout/models/PayoutPreparationStateData";
import { PayoutCommandOptions } from "../../../../../src/payout/schedulers/PayoutCommand";

import { PrepareBoost5Payouts } from "../../../../../src/payout/schedulers/BoosterPayouts/Boost5Payouts/PrepareBoost5Payouts";

let accountMocks: AccountDocument[] = [
  {
    slug: "fake-owner1",
    address: "fake-owner1",
  } as AccountDocument,
  {
    slug: "fake-owner2",
    address: "fake-owner2",
  } as AccountDocument,
  {
    slug: "fake-owner3",
    address: "fake-owner3",
  } as AccountDocument,
];

describe("payout/PrepareBoost5Payouts", () => {
  let command: PrepareBoost5Payouts;
  let configService: ConfigService;
  let stateService: StateService;
  let queryService: QueryService<AccountDocument, AccountModel>;
  let payoutsService: PayoutsService;
  let signerService: SignerService;
  let mathService: MathService;
  let logger: LogService;
  let assetsService: AssetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrepareBoost5Payouts,
        ConfigService,
        StateService,
        QueryService,
        PayoutsService,
        SignerService,
        AssetsService,
        MathService,
        EventEmitter2,
        AccountSessionsService,
        {
          provide: getModelToken("Payout"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Asset"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
        {
          provide: LogService,
          useValue: {
            setContext: jest.fn(),
            setModule: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
          },
        },
        {
          provide: getModelToken("AccountSession"),
          useValue: MockModel,
        },
      ]
    }).compile();

    command = module.get<PrepareBoost5Payouts>(PrepareBoost5Payouts);
    configService = module.get<ConfigService>(ConfigService);
    stateService = module.get<StateService>(StateService);
    queryService = module.get<QueryService<AccountDocument, AccountModel>>(QueryService);
    payoutsService = module.get<PayoutsService>(PayoutsService);
    signerService = module.get<SignerService>(SignerService);
    mathService = module.get<MathService>(MathService);
    logger = module.get<LogService>(LogService);
    assetsService = module.get<AssetsService>(AssetsService);
  });

  it("should be defined", () => {
    expect(command).toBeDefined();
  });

  it(`should set correct dappName`, () => {
    // prepare
    const configServiceGetCall = jest
      .spyOn(configService, "get")
      .mockReturnValue("test-dappName");

    // act
    const result = new PrepareBoost5Payouts(
      configService,
      stateService,
      queryService,
      payoutsService,
      signerService,
      logger,
      assetsService,
      mathService,
      MockModel,
    );

    // assert
    expect(configServiceGetCall).toHaveBeenNthCalledWith(3, "dappName");
    expect((result as any).dappIdentifier).toBe("test-dappname");
  });

  describe("getStateData()", () => {
    it("should return correct instance", () => {
      // prepare
      const totalNumberPrepared = 1;
      (command as any).totalNumberPrepared = totalNumberPrepared;
      const expectedResult = {
        totalNumberPrepared, 
      } as PayoutPreparationStateData;

      // act
      const result = (command as any).getStateData();

      // assert
      expect(result).toStrictEqual(expectedResult);
    });
  });

  describe("get command()", () => {
    it("should return correct result", () => {
      // act
      const result = (command as any).command;

      // assert
      expect(result).toBe("PrepareBoost5Payouts");
    });
  });

  describe("get signature()", () => {
    it("should return correct result", () => {
      // act
      const result = (command as any).signature;

      // assert
      expect(result).toBe("PrepareBoost5Payouts");
    });
  });

  describe("get collection()", () => {
    it("should return correct result", () => {
      // act
      const result = (command as any).collection; 

      // assert
      expect(result).toBe("accounts");
    });
  });

  describe("fetchSubjects()", () => {
    let aggregateMock = jest.fn().mockReturnValue([]);
    beforeEach(() => {
      (command as any).queryService = {
        aggregate: aggregateMock,
      };

      aggregateMock.mockClear();
    });

    it("should query accounts by total referred value", async () => {
      // act
      await (command as any).fetchSubjects();

      // assert
      expect(aggregateMock).toHaveBeenCalledTimes(1);
      expect(aggregateMock).toHaveBeenCalledWith([
        {
          $match: {
            referredBy: { $exists: true },
          },
        },
        {
          $group: {
            _id: {
              referredBy: "$referredBy",
            },
            count: { $sum: 1 },
          },
        },
      ], (command as any).model);
    });
  });

  describe("getAssetIdentifier()", () => {
    it("should use mosaic identifier from BOOST5 asset configuration", () => {
      // prepare
      const expectedId = "fake-identifier";
      (command as any).boosterAsset = { mosaicId: expectedId };

      // act
      const result = (command as any).getAssetIdentifier();

      // assert
      expect(result).toBe(expectedId);
    });
  });

  describe("getAssetAmount()", () => {
    beforeEach(() => {
      (command as any).boosterAsset = {
        mosaicId: "fake-identifier",
        divisibility: 0,
      };
    });

    it("should always return 1", () => {
      // act
      const result = (command as any).getAssetAmount(
        {} as AccountDocument
      );

      // assert
      expect(result).toBe(1);
    });

    it("should ignore subject and multiplier", () => {
      // act
      const result123 = (command as any).getAssetAmount(
        {} as AccountDocument, 1.23
      );
      const result456 = (command as any).getAssetAmount(
        {} as AccountDocument, 4.56
      );

      // assert
      expect(result123).toBe(1);
      expect(result456).toBe(1);
    });
  });

  describe("getMultiplier()", () => {
    beforeEach(() => {
      (command as any).boosterAsset = {
        mosaicId: "fake-identifier",
        divisibility: 0,
      };

      (command as any).boosterParameters = {
        "boost5": { minReferred: 10 },
        "boost10": { minReferred: 50 },
        "boost15": { minReferred: 100 },
      };
    });

    it("should always return 1", async () => {
      // act
      const result = await (command as any).getMultiplier("fake-subject-address");

      // assert
      expect(result).toBe(1);
    });

    it("should ignore subject address", async () => {
      // act
      const result123 = await (command as any).getMultiplier("fake-subject-address")
      const result456 = await (command as any).getMultiplier("other-subject-address")

      // assert
      expect(result123).toBe(1);
      expect(result456).toBe(1);
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

    it("should filter subjects by slug and set custom data", async () => {
      // prepare
      const expectedSlug = "fake-payout-subject-slug";
      const expectedData = { payoutState: PayoutState.Prepared };

      // act
      await (command as any).updatePayoutSubject(
        { slug: expectedSlug } as AccountDocument,
        expectedData,
      );

      // assert
      expect(queryCreateOrUpdateMock).toHaveBeenCalledTimes(1);
      expect(queryCreateOrUpdateMock).toHaveBeenCalledWith(
        new AccountQuery(
          { slug: expectedSlug } as AccountDocument,
        ),
        (command as any).model,
        expectedData
      );
    });
  });

  describe("execute()", () => {
    let accountMock = {
      slug: "fake-slug",
      address: "fake-owner",
    } as AccountDocument;
    const mockTotalNumberPrepared = 100;
    const mockPublicKey = "fake-signer-public-key";
    const mockSignedPayload = "fake-serialized-signed-transaction";
    const mockTransactionHash = "fake-transaction-hash";
    const updatePayoutSubjectMock = jest.fn();
    const fetchSubjectsEmptyMock = jest.fn().mockReturnValue(Promise.resolve([]));
    const fetchSubjectsNonEmptyMock = jest.fn().mockReturnValue(Promise.resolve([
      accountMock,
    ]));
    const fetchSubjectsActualMock = jest.fn().mockReturnValue(
      Promise.resolve(accountMocks),
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
      (command as any).boosterAsset = {
        mosaicId: "fake-identifier",
        divisibility: 0,
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
      (command as any).getMultiplier = jest.fn().mockReturnValue(1);

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
      expect(payoutsCreateOrUpdateMock).toHaveBeenCalledTimes(3); // 3 subjects
      expect(signerGetSignerPublicKeyMock).toHaveBeenCalledTimes(3); // 3 payouts
      expect(signerSignTransactionMock).toHaveBeenCalledTimes(3); // 3 payouts
      expect(updatePayoutSubjectMock).not.toHaveBeenCalled(); // <-- booster do not update subject
      expect((command as any).totalNumberPrepared).toBe(
        mockTotalNumberPrepared + 3, // 3 payouts
      );
    });

    it("should update payout document state after signature", async () => {
      // prepare
      (command as any).fetchSubjects = fetchSubjectsActualMock; // <-- non-empty
      const expectedAssets1 = [
        { amount: 1, mosaicId: "fake-identifier" },
      ];
      const expectedAssets2 = [
        { amount: 1, mosaicId: "fake-identifier" },
      ];
      (command as any).state = {
        data: { totalNumberPrepared: null }
      }

      // act
      await command.execute({
        dryRun: true,
        debug: true,
      });

      // assert
      expect(payoutsCreateOrUpdateMock).toHaveBeenCalledTimes(3); // 3 payouts
      expect(payoutsCreateOrUpdateMock).toHaveBeenNthCalledWith(1,
        new PayoutQuery({
          subjectSlug: accountMocks[0].slug,
          subjectCollection: "accounts",
          userAddress: accountMocks[0].address,
        } as PayoutDocument),
        {
          payoutState: PayoutState.Prepared,
          payoutAssets: expectedAssets1,
          signedBytes: mockSignedPayload,
          transactionHash: mockTransactionHash,
        },
      );
      expect(payoutsCreateOrUpdateMock).toHaveBeenNthCalledWith(2,
        new PayoutQuery({
          subjectSlug: accountMocks[1].slug,
          subjectCollection: "accounts",
          userAddress: accountMocks[1].address,
        } as PayoutDocument),
        {
          payoutState: PayoutState.Prepared,
          payoutAssets: expectedAssets2,
          signedBytes: mockSignedPayload,
          transactionHash: mockTransactionHash,
        },
      );
    });
  });

  describe("runAsScheduler()", () => {
    it("should call correct methods and run correctly", async () => {
      // prepare
      const loggerSetModuleCall = jest
        .spyOn(logger, "setModule")
        .mockReturnValue(logger);
      const debugLogCall = jest
        .spyOn((command as any), "debugLog")
        .mockReturnValue(true);
      const runCall = jest
        .spyOn(command, "run")
        .mockResolvedValue();

      // act
      await command.runAsScheduler();

      // assert
      expect(loggerSetModuleCall).toHaveBeenNthCalledWith(1, "payout/PrepareBoost5Payouts");
      expect(debugLogCall).toHaveBeenNthCalledWith(1, `Starting payout preparation for booster type: boost5`);
      expect(debugLogCall).toHaveBeenNthCalledWith(2, `Total number of boost5 payouts prepared: "0"`);
      expect(runCall).toHaveBeenNthCalledWith(
        1,
        ["accounts"],
        {
          debug: true,
        } as PayoutCommandOptions
      );
    });
  });
});
