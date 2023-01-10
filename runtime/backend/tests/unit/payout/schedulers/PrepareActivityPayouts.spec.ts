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
import { MockModel } from "../../../mocks/global";

// common scope
import { StateService } from "../../../../src/common/services/StateService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { LogService } from "../../../../src/common/services/LogService";

// users scope
import { ActivityDocument, ActivityModel, ActivityQuery } from "../../../../src/users/models/ActivitySchema";
import { ProcessingState } from "../../../../src/users/models/ProcessingStatusDTO";

// payout scope
import { PayoutState } from "../../../../src/payout/models/PayoutStatusDTO";
import { PayoutDocument, PayoutQuery } from "../../../../src/payout/models/PayoutSchema";
import { PayoutsService } from "../../../../src/payout/services/PayoutsService";
import { SignerService } from "../../../../src/payout/services/SignerService";
import { MathService } from "../../../../src/payout/services/MathService";
import { PrepareActivityPayouts } from "../../../../src/payout/schedulers/ActivityPayouts/PrepareActivityPayouts";
import { AccountSessionsService } from "../../../../src/common/services/AccountSessionsService";
import { PayoutPreparationStateData } from "../../../../src/payout/models/PayoutPreparationStateData";
import { PayoutCommandOptions } from "../../../../src/payout/schedulers/PayoutCommand";

const mockActivityRewardWalkFormulaFirst = Math.round(Math.floor(
  ((2/4)*1.2) * 100 // <-- 2 zeros (L172)
));

const mockActivityRewardWalkFormulaFirstMultiplied123 = Math.round(Math.floor(
  (((2/4)*1.2)*1.23) * 100 // <-- 2 zeros (L172)
));

const mockActivityRewardWalkFormulaSecond = Math.round(Math.floor(
  ((4/2)*1.2) * 100 // <-- 2 zeros (L172)
));

const mockActivityRewardWalkFormulaSecondMultiplied456 = Math.round(Math.floor(
  (((4/2)*1.2)*4.56) * 100 // <-- 2 zeros (L172)
));

const mockActivityRewardWalkFormulaThird = Math.round(Math.floor(
  ((8/6)*1.2) * 100 // <-- 2 zeros (L172)
));

const mockActivityRewardWalkFormulaFirstDiv3 = Math.round(Math.floor(
  ((2/4)*1.2) * 1000 // <-- 3 zeros
));

const mockActivityRewardWalkFormulaFirstDiv6 = Math.round(Math.floor(
  ((2/4)*1.2) * 1000000 // <-- 6 zeros
));

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
      isManual: false,
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
      isManual: false,
    }
  } as ActivityDocument,
  {
    slug: "fake-slug3",
    address: "fake-owner3",
    createdAt: new Date(),
    activityData: {
      sport: "Walk",
      calories: 9,
      distance: 8,
      elevation: 0, // <-- E:0
      elapsedTime: 6,
      kilojoules: 5,
      isManual: false,
    }
  } as ActivityDocument,
];

const manualActivityMock = {
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
    isManual: true,
  }
} as ActivityDocument;

const emptyActivityMock = {
  slug: "fake-slug1",
  address: "fake-owner1",
  createdAt: new Date(),
  activityData: {
    sport: "Walk",
    calories: 0,
    distance: 0,
    elevation: 0,
    elapsedTime: 0,
    kilojoules: 0,
    isManual: true,
  }
} as ActivityDocument;

describe("payout/PrepareActivityPayouts", () => {
  let command: PrepareActivityPayouts;
  let configService: ConfigService;
  let stateService: StateService;
  let queryService: QueryService<ActivityDocument, ActivityModel>;
  let payoutsService: PayoutsService;
  let signerService: SignerService;
  let mathService: MathService;
  let logger: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrepareActivityPayouts,
        ConfigService,
        StateService,
        QueryService,
        PayoutsService,
        SignerService,
        MathService,
        EventEmitter2,
        AccountSessionsService,
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

    command = module.get<PrepareActivityPayouts>(PrepareActivityPayouts);
    configService = module.get<ConfigService>(ConfigService);
    stateService = module.get<StateService>(StateService);
    queryService = module.get<QueryService<ActivityDocument, ActivityModel>>(QueryService);
    payoutsService = module.get<PayoutsService>(PayoutsService);
    signerService = module.get<SignerService>(SignerService);
    mathService = module.get<MathService>(MathService);
    logger = module.get<LogService>(LogService);
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
    const result = new PrepareActivityPayouts(
      configService,
      stateService,
      queryService,
      payoutsService,
      signerService,
      logger,
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
    const mathSkewNormalMock = jest.fn().mockReturnValue(0.8);

    beforeEach(() => {
      (command as any).earnAsset = {
        mosaicId: "fake-identifier",
        divisibility: 2,
      };

      (command as any).mathService = {
        skewNormal: mathSkewNormalMock,
      };

      mathSkewNormalMock.mockClear();
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
      ["", "Walk", "Run", "Ride", "Swim"].forEach((sport: string) => {
        // act
        const result = (command as any).getAssetAmount({
          ...activityMock,
          activityData: {
            ...activityMock.activityData,
            sport, // <-- forces run type
          },
        });

        // assert
        expect(result).not.toBe(0);
      });
    });

    it("should convert to a correct absolute amount", () => {
      // prepare
      (command as any).earnAsset = {
        mosaicId: "fake-identifier",
        divisibility: 3, // <-- forcing divisibility 3
      };
      // note that this uses the Walk formula
      const expectedValue = mockActivityRewardWalkFormulaFirstDiv3; // <-- 3 zeros

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
      const expectedValue = mockActivityRewardWalkFormulaFirstDiv6;

      // act
      const result = (command as any).getAssetAmount(activityMock);

      // assert
      expect(result).toBe(expectedValue);
    });

    it("should always round to correct integer value for amount", () => {
      // prepare
      const walkFormula = mockActivityRewardWalkFormulaFirst;
      const otherFormula = mockActivityRewardWalkFormulaSecond;

      // act
      const result1 = (command as any).getAssetAmount(activityMocks[0]);
      const result2 = (command as any).getAssetAmount(activityMocks[1]);

      // assert
      expect(result1).toBe(walkFormula);
      expect(result2).toBe(otherFormula);
    });

    it("should return zero given empty elapsed time", () => {
      // act
      const result1 = (command as any).getAssetAmount({
        ...activityMocks[0],
        activityData: {
          ...activityMocks[0].activityData,
          elapsedTime: 0,
        }
      });
      const result2 = (command as any).getAssetAmount({
        ...activityMocks[1],
        activityData: {
          ...activityMocks[1].activityData,
          elapsedTime: 0,
        }
      });

      // assert
      expect(result1).toBe(0);
      expect(result2).toBe(0);
    });

    it("should return zero given manual activity", () => {
      // act
      const result1 = (command as any).getAssetAmount({
        ...activityMocks[0],
        activityData: {
          ...activityMocks[0].activityData,
          isManual: true,
        }
      });
      const result2 = (command as any).getAssetAmount({
        ...activityMocks[1],
        activityData: {
          ...activityMocks[1].activityData,
          isManual: true,
        }
      });

      // assert
      expect(result1).toBe(0);
      expect(result2).toBe(0);
    });

    it("should use correct multiplier and apply to amount", () => {
      // prepare
      const walkFormula = mockActivityRewardWalkFormulaFirstMultiplied123;
      const otherFormula = mockActivityRewardWalkFormulaSecondMultiplied456;

      // act
      const result1 = (command as any).getAssetAmount(activityMocks[0], 1.23);
      const result2 = (command as any).getAssetAmount(activityMocks[1], 4.56);

      // assert
      expect(result1).toBe(walkFormula);
      expect(result2).toBe(otherFormula);
    });

    it("should default to multiplier 1 given none", () => {
      // prepare
      const walkFormula = mockActivityRewardWalkFormulaFirst; // <-- not multiplied
      const otherFormula = mockActivityRewardWalkFormulaSecond; // <-- not multiplied

      // act
      const result1 = (command as any).getAssetAmount(activityMocks[0]);
      const result2 = (command as any).getAssetAmount(activityMocks[1]);

      // assert
      expect(result1).toBe(walkFormula);
      expect(result2).toBe(otherFormula);
    });

    it("should use absolute value for multiplier to disallow negative", () => {
      // prepare
      const walkFormula = mockActivityRewardWalkFormulaFirstMultiplied123;
      const otherFormula = mockActivityRewardWalkFormulaSecond; // <-- not multiplied

      // act
      const result1 = (command as any).getAssetAmount(activityMocks[0], -1.23); // <-- negative
      const result2 = (command as any).getAssetAmount(activityMocks[1], -1); // <-- negative

      // assert
      expect(result1).toBe(walkFormula);
      expect(result2).toBe(otherFormula);
    });
  });

  describe("getMultiplier()", () => {
    let aggregateMock = jest.fn().mockReturnValue([
      { count: 2 },
    ])
    beforeEach(() => {
      (command as any).earnAsset = {
        mosaicId: "fake-identifier",
        divisibility: 2,
      };

      (command as any).queryService = {
        aggregate: aggregateMock,
      };

      (command as any).boosterParameters = {
        "boost5": { minReferred: 10 },
        "boost10": { minReferred: 50 },
        "boost15": { minReferred: 100 },
      };

      aggregateMock.mockClear();
    });

    it("should use query service to execute aggregate query", async () => {
      // act
      await (command as any).getMultiplier("fake-subject-address");

      // assert
      expect(aggregateMock).toHaveBeenCalledTimes(1);
    });

    it("should use correct boost percentage given referrals", async () => {
      // prepare
      const fakeReferralCounts = [
        { count: 3, expectedPc: 1 },
        { count: 5, expectedPc: 1 },
        { count: 7, expectedPc: 1 },
        { count: 10, expectedPc: 1.05 },
        { count: 49, expectedPc: 1.05},
        { count: 50, expectedPc: 1.10 },
        { count: 57, expectedPc: 1.10 },
        { count: 99, expectedPc: 1.10 },
        { count: 100, expectedPc: 1.15 },
        { count: 150, expectedPc: 1.15 },
        { count: -1, expectedPc: 1 },
        { count: 0, expectedPc: 1 },
      ];

      fakeReferralCounts.map(
        async (obj) => {
          // prepare each round
          (command as any).queryService = {
            aggregate: jest.fn().mockReturnValue([
              { count: obj.count }, // <-- at [0].count
            ]),
          };

          // act
          const result = await (command as any).getMultiplier("fake-subject-address");

          // assert
          expect(result).toBe(obj.expectedPc);
        }
      )
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
      await (command as any).updatePayoutSubject(
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
    const mockActivityReward = mockActivityRewardWalkFormulaFirst;
    const mockActivityRewardReverse = mockActivityRewardWalkFormulaSecond;
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
      expect(updatePayoutSubjectMock).toHaveBeenCalledTimes(3); // 3 subjects
      expect((command as any).totalNumberPrepared).toBe(
        mockTotalNumberPrepared + 3, // 3 payouts
      );
    });

    it("should update payout document state after signature", async () => {
      // prepare
      (command as any).fetchSubjects = fetchSubjectsActualMock; // <-- non-empty
      const expectedAssets1 = [
        { amount: mockActivityReward, mosaicId: "fake-identifier" },
      ];
      const expectedAssets2 = [
        { amount: mockActivityRewardReverse, mosaicId: "fake-identifier" },
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
          subjectSlug: activityMocks[0].slug,
          subjectCollection: "activities",
          userAddress: activityMocks[0].address,
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
          subjectSlug: activityMocks[1].slug,
          subjectCollection: "activities",
          userAddress: activityMocks[1].address,
        } as PayoutDocument),
        {
          payoutState: PayoutState.Prepared,
          payoutAssets: expectedAssets2,
          signedBytes: mockSignedPayload,
          transactionHash: mockTransactionHash,
        },
      );
    });

    it("should set state to Not_Eligible for empty amounts", async () => {
      // prepare
      const fetchSubjectsManualMock = jest.fn().mockReturnValue(
        Promise.resolve([
          manualActivityMock, // <-- activityData.isManual=true
          emptyActivityMock, // <-- "theAmount"=0
        ]),
      );
      (command as any).fetchSubjects = fetchSubjectsManualMock; // <-- non-empty

      // act
      await command.execute({
        dryRun: true,
        debug: true,
      });

      // assert
      expect(payoutsCreateOrUpdateMock).toHaveBeenCalledTimes(2); // 2 payout
      expect(updatePayoutSubjectMock).toHaveBeenCalledTimes(2); // 2 activities
      expect(payoutsCreateOrUpdateMock).toHaveBeenNthCalledWith(1,
        new PayoutQuery({
          subjectSlug: manualActivityMock.slug,
          subjectCollection: "activities",
          userAddress: manualActivityMock.address,
        } as PayoutDocument),
        {
          payoutState: PayoutState.Not_Eligible, // <-- payouts.payoutState=Not_Eligible
        },
      );
      expect(payoutsCreateOrUpdateMock).toHaveBeenNthCalledWith(1,
        new PayoutQuery({
          subjectSlug: emptyActivityMock.slug,
          subjectCollection: "activities",
          userAddress: emptyActivityMock.address,
        } as PayoutDocument),
        {
          payoutState: PayoutState.Not_Eligible, // <-- payouts.payoutState=Not_Eligible
        },
      );
      expect(updatePayoutSubjectMock).toHaveBeenNthCalledWith(1,
        manualActivityMock,
        {
          payoutState: PayoutState.Not_Eligible, // <-- activities.payoutState=Not_Eligible
        }
      );
      expect(updatePayoutSubjectMock).toHaveBeenNthCalledWith(2,
        emptyActivityMock,
        {
          payoutState: PayoutState.Not_Eligible, // <-- activities.payoutState=Not_Eligible
        }
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
      expect(loggerSetModuleCall).toHaveBeenNthCalledWith(1, "payout/PrepareActivityPayouts");
      expect(debugLogCall).toHaveBeenNthCalledWith(1, `Starting payout preparation for subjects type: activities`);
      expect(debugLogCall).toHaveBeenNthCalledWith(2, `Total number of payouts prepared: "0"`);
      expect(runCall).toHaveBeenNthCalledWith(
        1,
        ["activities"],
        {
          debug: true,
        } as PayoutCommandOptions
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
      expect(loggerSetModuleCall).toHaveBeenNthCalledWith(1, "payout/PrepareActivityPayouts");
      expect(debugLogCall).toHaveBeenNthCalledWith(1, `Starting payout preparation for subjects type: activities`);
      expect(debugLogCall).toHaveBeenNthCalledWith(2, `Total number of payouts prepared: "0"`);
      expect(runCall).toHaveBeenNthCalledWith(
        1,
        ["activities"],
        {
          debug: true,
        } as PayoutCommandOptions
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
      expect(loggerSetModuleCall).toHaveBeenNthCalledWith(1, "payout/PrepareActivityPayouts");
      expect(debugLogCall).toHaveBeenNthCalledWith(1, `Starting payout preparation for subjects type: activities`);
      expect(debugLogCall).toHaveBeenNthCalledWith(2, `Total number of payouts prepared: "0"`);
      expect(runCall).toHaveBeenNthCalledWith(
        1,
        ["activities"],
        {
          debug: true,
        } as PayoutCommandOptions
      );
    });
  });
});
