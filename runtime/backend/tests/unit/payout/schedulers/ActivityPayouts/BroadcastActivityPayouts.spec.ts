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
import { TransactionMapping } from "@dhealth/sdk";
import { EventEmitter2 } from "@nestjs/event-emitter";

// internal dependencies
import { MockModel } from "../../../../mocks/global";

// common scope
import { LogService } from "../../../../../src/common/services/LogService";
import { StateService } from "../../../../../src/common/services/StateService";
import { QueryService } from "../../../../../src/common/services/QueryService";
import { NetworkService } from "../../../../../src/common/services/NetworkService";

// discovery scope
import {
  AssetQuery,
  AssetDocument,
} from "../../../../../src/discovery/models/AssetSchema";
import { AssetsService } from "../../../../../src/discovery/services/AssetsService";

// users scope
import { ActivityDocument, ActivityModel, ActivityQuery } from "../../../../../src/users/models/ActivitySchema";
import { ActivitiesService } from "../../../../../src/users/services/ActivitiesService";

// payout scope
import { PayoutState } from "../../../../../src/payout/models/PayoutStatusDTO";
import { PayoutDocument, PayoutQuery } from "../../../../../src/payout/models/PayoutSchema";
import { PayoutsService } from "../../../../../src/payout/services/PayoutsService";
import { SignerService } from "../../../../../src/payout/services/SignerService";
import { BroadcastActivityPayouts, BroadcastActivityPayoutsCommandOptions } from "../../../../../src/payout/schedulers/ActivityPayouts/BroadcastActivityPayouts";
import { PayoutBroadcastStateData } from "../../../../../src/payout/models/PayoutBroadcastStateData";

const payoutMocks = [
  {
    subjectSlug: "fake-subject1",
    subjectCollection: "activities",
    userAddress: "fake-owner1",
    signedBytes: "fake-signed-bytes1",
    transactionHash: "fake-hash1",
    payoutAssets: [{mosaicId: "fakeMosaic", amount: 1}],
    payoutState: PayoutState.Prepared,
  } as PayoutDocument,
  {
    subjectSlug: "fake-subject2",
    subjectCollection: "activities",
    userAddress: "fake-owner2",
    signedBytes: "fake-signed-bytes2",
    transactionHash: "fake-hash2",
    payoutAssets: [{mosaicId: "fakeMosaic", amount: 2}],
    payoutState: PayoutState.Prepared,
  } as PayoutDocument,
  {
    subjectSlug: "fake-subject3",
    subjectCollection: "activities",
    userAddress: "fake-owner3",
    signedBytes: "fake-signed-bytes3",
    transactionHash: "fake-hash3",
    payoutAssets: [{mosaicId: "fakeMosaic", amount: 3}],
    payoutState: PayoutState.Prepared,
  } as PayoutDocument,
  {
    subjectSlug: "fake-subject4",
    subjectCollection: "activities",
    userAddress: "fake-owner4",
    signedBytes: "fake-signed-bytes4",
    transactionHash: "fake-hash4",
    payoutAssets: [{mosaicId: "fakeMosaic", amount: 4}],
    payoutState: PayoutState.Prepared,
  } as PayoutDocument,
];

const notEligiblePayoutMock = {
  subjectSlug: "fake-subject5",
  subjectCollection: "activities",
  userAddress: "fake-owner5",
  signedBytes: "fake-signed-bytes5",
  transactionHash: "fake-hash5",
  payoutAssets: [{mosaicId: "fakeMosaic", amount: 5}],
  payoutState: PayoutState.Not_Eligible,
} as PayoutDocument;

describe("payout/BroadcastActivityPayouts", () => {
  let command: BroadcastActivityPayouts;
  let configService: ConfigService;
  let stateService: StateService;
  let networkService: NetworkService;
  let queryService: QueryService<ActivityDocument, ActivityModel>;
  let payoutsService: PayoutsService;
  let signerService: SignerService;
  let activitiesService: ActivitiesService;
  let logger: LogService;
  let assetsService: AssetsService;
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
        ActivitiesService,
        AssetsService,
        EventEmitter2,
        {
          provide: getModelToken("Payout"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Asset"),
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
      ]
    }).compile();

    command = module.get<BroadcastActivityPayouts>(BroadcastActivityPayouts);
    configService = module.get<ConfigService>(ConfigService);
    stateService = module.get<StateService>(StateService);
    networkService = module.get<NetworkService>(NetworkService);
    queryService = module.get<QueryService<ActivityDocument, ActivityModel>>(QueryService);
    payoutsService = module.get<PayoutsService>(PayoutsService);
    signerService = module.get<SignerService>(SignerService);
    activitiesService = module.get<ActivitiesService>(ActivitiesService);
    logger = module.get<LogService>(LogService);
    assetsService = module.get<AssetsService>(AssetsService);
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

    it("should forward to query service with correct query", async () => {
      // prepare
      (command as any).payoutsService = payoutsService; // L113
      const modelAggregateMock = jest.fn().mockReturnValue({
        exec: jest.fn().mockReturnValue([{
          data: [],
          metadata: []
        }]),
      });
      (payoutsService as any).model = {
        aggregate: modelAggregateMock,
      };
      const queryFindMock = jest.spyOn(queryService, "find");

      // act
      const useManualLimit = 2;
      await (command as any).fetchSubjects(useManualLimit);

      // assert
      expect(queryFindMock).toHaveBeenCalledTimes(1);
      expect(queryFindMock).toHaveBeenCalledWith(new PayoutQuery(
        {
          payoutState: PayoutState.Prepared,
          subjectCollection: (command as any).collection
        } as PayoutDocument,
        {
          pageNumber: 1,
          pageSize: useManualLimit,
          sort: "createdAt",
          order: "asc",
        },
      ), (payoutsService as any).model);
      expect(modelAggregateMock).toHaveBeenCalledTimes(1);
      expect(modelAggregateMock).toHaveBeenCalledWith([
        {
          $match: {
            payoutState: {
              $in: [PayoutState.Prepared, PayoutState.Prepared]
            },
            subjectCollection: "activities",
          },
        },
        {
          $facet: {
            data: [
              { $skip: 0 },
              { $limit: useManualLimit },
              { $sort: { createdAt: 1 } },
            ],
            metadata: [{ $count: "total" }],
          },
        },
      ]);
    });
  });

  describe("getStateData()", () => {
    it("should return correct instance", () => {
      // prepare
      (command as any).lastExecutedAt = 0;
      const expectedResult = {
        lastExecutedAt: 0,
      } as PayoutBroadcastStateData;

      // act
      const result = (command as any).getStateData();

      // assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe("execute()", () => {
    let debugLogMock: any,
        infoLogMock: any;
    const fetchSubjectsEmptyMock = jest.fn().mockReturnValue(Promise.resolve([]));
    const fetchSubjectsNonEmptyMock = jest.fn().mockReturnValue(Promise.resolve([
      {} as PayoutDocument,
    ]));
    const fetchSubjectsActualMock = jest.fn().mockReturnValue(
      Promise.resolve(payoutMocks),
    );
    const updatePayoutSubjectMock = jest.fn();
    const payoutsCreateOrUpdateMock = jest.fn();
    const activitiesCreateOrUpdateMock = jest.fn();
    const assetsCreateOrUpdateMock = jest.fn();
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
        getChainInfo: jest.fn().mockReturnValue({
          height: {
            compact: () => 1, // <-- forces height=1
          }
        }),
        transactionRepository: {
          announce: transactionAnnounceMock,
        },
      };
      (command as any).activitiesService = {
        createOrUpdate: activitiesCreateOrUpdateMock,
      };
      (command as any).assetsService = {
        createOrUpdate: assetsCreateOrUpdateMock,
      };

      debugLogMock = jest.spyOn((command as any), "debugLog");
      infoLogMock = jest.spyOn((command as any), "infoLog");
      jest.clearAllMocks();
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
      (command as any).fetchSubjects = jest.fn().mockReturnValue(
        Promise.resolve([payoutMocks[0]]),
      ); // <-- only one
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
      expect((command as any).transactions).toBeDefined();
      expect(Object.keys((command as any).transactions).length).toBe(1); // 1 payouts
      expect(createFromPayloadMock).toHaveBeenCalledTimes(expectedCount);
      expect(createFromPayloadMock).toHaveBeenNthCalledWith(1, payoutMocks[0].signedBytes, false);
    });

    it("should re-build transaction using correct signed payloads", async () => {
      // prepare
      (command as any).fetchSubjects = fetchSubjectsActualMock; // <-- 4 payouts
      const createFromPayloadMock = jest.spyOn(TransactionMapping, "createFromPayload")
        .mockReturnValue(transactionMock as any);
      const expectedCount = 4;

      // act
      await command.execute({
        maxCount: expectedCount,
        dryRun: true, // <-- dry-run
        debug: true,
      });

      // assert
      expect((command as any).transactions).toBeDefined();
      expect(Object.keys((command as any).transactions).length).toBe(4); // 4 payouts
      expect(createFromPayloadMock).toHaveBeenCalledTimes(expectedCount);
      expect(createFromPayloadMock).toHaveBeenNthCalledWith(1, payoutMocks[0].signedBytes, false);
      expect(createFromPayloadMock).toHaveBeenNthCalledWith(2, payoutMocks[1].signedBytes, false);
      expect(createFromPayloadMock).toHaveBeenNthCalledWith(3, payoutMocks[2].signedBytes, false);
      expect(createFromPayloadMock).toHaveBeenNthCalledWith(4, payoutMocks[3].signedBytes, false);
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
      expect(activitiesCreateOrUpdateMock).not.toHaveBeenCalled();
      expect(assetsCreateOrUpdateMock).not.toHaveBeenCalled();
    });

    it("should broadcast a maximum number of payouts given maxCount", async () => {
      // prepare
      (command as any).globalDryRun = false;
      (command as any).fetchSubjects = fetchSubjectsActualMock; // <-- 4 payouts
      const expectedCount = 1; // <-- maxCount=1

      // act
      await command.execute({
        maxCount: 1,
        dryRun: false, // <-- production
        debug: true,
      });

      // assert
      expect(networkDelegatePromisesMock).toHaveBeenCalledTimes(1); // delegates all in one
      expect(payoutsCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount); // maxCount=1
      expect(activitiesCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount); // maxCount=1
      expect(assetsCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount); // maxCount=1
      expect(transactionAnnounceToPromiseMock).toHaveBeenCalledTimes(expectedCount); // maxCount=1
    });

    it("should broadcast a maximum number of payouts given data limitation", async () => {
      // prepare
      (command as any).globalDryRun = false;
      (command as any).fetchSubjects = fetchSubjectsActualMock; // <-- 4 payouts
      const expectedCount = payoutMocks.length; // <-- mocked array

      // act
      await command.execute({
        maxCount: 10, // <-- higher than number of payouts
        dryRun: false, // <-- production
        debug: true,
      });

      // assert
      expect(networkDelegatePromisesMock).toHaveBeenCalledTimes(1); // delegates all in one
      expect(payoutsCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount);
      expect(activitiesCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount);
      expect(assetsCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount);
      expect(transactionAnnounceToPromiseMock).toHaveBeenCalledTimes(expectedCount);
    });

    it("should broadcast and update state given production mode", async () => {
      // prepare
      (command as any).globalDryRun = false;
      (command as any).fetchSubjects = fetchSubjectsActualMock; // <-- 4 payouts
      const expectedCount = 2;

      // act
      await command.execute({
        maxCount: expectedCount,
        dryRun: false, // <-- production
        debug: true,
      });

      // assert
      expect(networkDelegatePromisesMock).toHaveBeenCalledTimes(1); // delegates all in one
      expect(payoutsCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount); // 2 payouts
      expect(activitiesCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount); // 2 subjects
      expect(assetsCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount); // 2 subjects
      expect(transactionAnnounceToPromiseMock).toHaveBeenCalledTimes(expectedCount);
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
      expect(activitiesCreateOrUpdateMock).toHaveBeenNthCalledWith(1, 
        new ActivityQuery({
          slug: payoutMocks[0].subjectSlug
        } as ActivityDocument),
        { payoutState: PayoutState.Broadcast },
      );
      expect(activitiesCreateOrUpdateMock).toHaveBeenNthCalledWith(2, 
        new ActivityQuery({
          slug: payoutMocks[1].subjectSlug
        } as ActivityDocument),
        { payoutState: PayoutState.Broadcast },
      );
      expect(assetsCreateOrUpdateMock).toHaveBeenNthCalledWith(1, 
        new AssetQuery({
          transactionHash: payoutMocks[0].transactionHash,
        } as AssetDocument),
        {
          userAddress: payoutMocks[0].userAddress,
          mosaicId: payoutMocks[0].payoutAssets[0].mosaicId,
          amount: payoutMocks[0].payoutAssets[0].amount,
          creationBlock: 1, // <-- forced height=1 in beforeEach
        },
      );
      expect(assetsCreateOrUpdateMock).toHaveBeenNthCalledWith(2, 
        new AssetQuery({
          transactionHash: payoutMocks[1].transactionHash,
        } as AssetDocument),
        {
          userAddress: payoutMocks[1].userAddress,
          mosaicId: payoutMocks[1].payoutAssets[0].mosaicId,
          amount: payoutMocks[1].payoutAssets[0].amount,
          creationBlock: 1, // <-- forced height=1 in beforeEach
        },
      );
    });

    it("should not broadcast payouts that are flagged Not_Eligible", async () => {
      // prepare
      (command as any).globalDryRun = false;
      const fetchSubjectManualMock = jest.fn().mockReturnValue(
        Promise.resolve(
          payoutMocks.concat(notEligiblePayoutMock), // adds 1 Not_Eligible payout
        ),
      ); // <-- 4 payouts
      (command as any).fetchSubjects = fetchSubjectManualMock;
      const expectedCount = payoutMocks.length; // <-- does not contain Not_Eligible

      // act
      await command.execute({
        maxCount: 10,
        dryRun: false, // <-- production
        debug: true,
      });

      // assert
      expect(networkDelegatePromisesMock).toHaveBeenCalledTimes(1); // delegates all in one
      expect(payoutsCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount);
      expect(activitiesCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount);
      expect(assetsCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount);
      expect(transactionAnnounceToPromiseMock).toHaveBeenCalledTimes(expectedCount);
    });

    it("should broadcast all payouts and update state correctly", async () => {
      // prepare
      (command as any).globalDryRun = false;
      const fetchSubjectManualMock = fetchSubjectsActualMock; // <-- 4 payouts
      (command as any).fetchSubjects = fetchSubjectManualMock;
      const expectedCount = payoutMocks.length; // <-- 4 payouts

      // act
      await command.execute({
        maxCount: expectedCount,
        dryRun: false, // <-- production
        debug: true,
      });

      // assert
      expect(networkDelegatePromisesMock).toHaveBeenCalledTimes(1); // delegates all in one
      expect(payoutsCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount);
      expect(activitiesCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount);
      expect(assetsCreateOrUpdateMock).toHaveBeenCalledTimes(expectedCount);
      expect(transactionAnnounceToPromiseMock).toHaveBeenCalledTimes(expectedCount);
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
      expect(activitiesCreateOrUpdateMock).toHaveBeenNthCalledWith(1, 
        new ActivityQuery({
          slug: payoutMocks[0].subjectSlug
        } as ActivityDocument),
        { payoutState: PayoutState.Broadcast },
      );
      expect(assetsCreateOrUpdateMock).toHaveBeenNthCalledWith(1, 
        new AssetQuery({
          transactionHash: payoutMocks[0].transactionHash,
        } as AssetDocument),
        {
          userAddress: payoutMocks[0].userAddress,
          mosaicId: payoutMocks[0].payoutAssets[0].mosaicId,
          amount: payoutMocks[0].payoutAssets[0].amount,
          creationBlock: 1, // <-- forced height=1 in beforeEach
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
      expect(activitiesCreateOrUpdateMock).toHaveBeenNthCalledWith(2, 
        new ActivityQuery({
          slug: payoutMocks[1].subjectSlug
        } as ActivityDocument),
        { payoutState: PayoutState.Broadcast },
      );
      expect(assetsCreateOrUpdateMock).toHaveBeenNthCalledWith(2, 
        new AssetQuery({
          transactionHash: payoutMocks[1].transactionHash,
        } as AssetDocument),
        {
          userAddress: payoutMocks[1].userAddress,
          mosaicId: payoutMocks[1].payoutAssets[0].mosaicId,
          amount: payoutMocks[1].payoutAssets[0].amount,
          creationBlock: 1, // <-- forced height=1 in beforeEach
        },
      );
      expect(payoutsCreateOrUpdateMock).toHaveBeenNthCalledWith(3,
        new PayoutQuery({
          userAddress: payoutMocks[2].userAddress,
          subjectSlug: payoutMocks[2].subjectSlug,
          subjectCollection: "activities",
        } as PayoutDocument),
        {
          payoutState: PayoutState.Broadcast,
        },
      );
      expect(activitiesCreateOrUpdateMock).toHaveBeenNthCalledWith(3, 
        new ActivityQuery({
          slug: payoutMocks[2].subjectSlug
        } as ActivityDocument),
        { payoutState: PayoutState.Broadcast },
      );
      expect(assetsCreateOrUpdateMock).toHaveBeenNthCalledWith(3, 
        new AssetQuery({
          transactionHash: payoutMocks[2].transactionHash,
        } as AssetDocument),
        {
          userAddress: payoutMocks[2].userAddress,
          mosaicId: payoutMocks[2].payoutAssets[0].mosaicId,
          amount: payoutMocks[2].payoutAssets[0].amount,
          creationBlock: 1, // <-- forced height=1 in beforeEach
        },
      );
      expect(payoutsCreateOrUpdateMock).toHaveBeenNthCalledWith(4,
        new PayoutQuery({
          userAddress: payoutMocks[3].userAddress,
          subjectSlug: payoutMocks[3].subjectSlug,
          subjectCollection: "activities",
        } as PayoutDocument),
        {
          payoutState: PayoutState.Broadcast,
        },
      );
      expect(activitiesCreateOrUpdateMock).toHaveBeenNthCalledWith(4, 
        new ActivityQuery({
          slug: payoutMocks[3].subjectSlug
        } as ActivityDocument),
        { payoutState: PayoutState.Broadcast },
      );
      expect(assetsCreateOrUpdateMock).toHaveBeenNthCalledWith(4, 
        new AssetQuery({
          transactionHash: payoutMocks[3].transactionHash,
        } as AssetDocument),
        {
          userAddress: payoutMocks[3].userAddress,
          mosaicId: payoutMocks[3].payoutAssets[0].mosaicId,
          amount: payoutMocks[3].payoutAssets[0].amount,
          creationBlock: 1, // <-- forced height=1 in beforeEach
        },
      );
    });

    it("should print correct info-level log given broadcast operation", async () => {
      // prepare
      (command as any).globalDryRun = false;
      const fetchSubjectManualMock = fetchSubjectsActualMock; // <-- 4 payouts
      (command as any).fetchSubjects = fetchSubjectManualMock;
      const expectedCount = payoutMocks.length; // <-- 4 payouts

      // act
      await command.execute({
        maxCount: expectedCount,
        dryRun: false, // <-- production
        debug: true,
      });

      // assert
      expect(networkDelegatePromisesMock).toHaveBeenCalledTimes(1); // delegates all in one
      expect(infoLogMock).toHaveBeenCalledTimes(1);
      expect(infoLogMock).toHaveBeenCalledWith(
        `Now broadcasting ${expectedCount} transaction(s)`,
      );
    });

    it("should map re-built transfer transactions using correct hash", async () => {
      // prepare
      (command as any).globalDryRun = false;
      const fetchSubjectManualMock = fetchSubjectsActualMock; // <-- 4 payouts
      (command as any).fetchSubjects = fetchSubjectManualMock;
      const createFromPayloadMock = jest.spyOn(TransactionMapping, "createFromPayload")
        .mockImplementation((signedBytes: string, isEmbedded: boolean) => {
          const payoutMock = payoutMocks.find(p => p.signedBytes === signedBytes);
          return {
            serialize: serializeMock,
            transactionInfo: {
              hash: payoutMock.transactionHash, // <-- each payout has 1 hash
            },
            signer: {
              publicKey: "fake-signer-publicKey1"
            },
            type: "fake-type",
            networkType: "fake-network",
          } as any;
        });
      const expectedCount = payoutMocks.length; // <-- 4 payouts

      // act
      await command.execute({
        maxCount: expectedCount,
        dryRun: false, // <-- production
        debug: true,
      });

      // assert
      expect(networkDelegatePromisesMock).toHaveBeenCalledTimes(1); // delegates all in one
      expect((command as any).transactions).toBeDefined();
      expect((command as any).transactionHashes).toBeDefined();
      expect((command as any).transactionHashes.length).toBe(expectedCount);

      const transactionHashes = (command as any).transactionHashes;
      transactionHashes.forEach((hash: string) => {
        const payoutMock = payoutMocks.find(p => p.transactionHash === hash);
        expect(hash in (command as any).transactions).toBe(true);
        expect((command as any).transactions[hash]).toStrictEqual({
          serialize: serializeMock,
          transactionInfo: {
            hash: payoutMock.transactionHash, // <-- each payout has 1 hash
          },
          signer: {
            publicKey: "fake-signer-publicKey1"
          },
          type: "fake-type",
          networkType: "fake-network",
        } as any);
      });
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
      expect(loggerSetModuleCall).toHaveBeenNthCalledWith(1, "payout/BroadcastActivityPayouts");
      expect(debugLogCall).toHaveBeenNthCalledWith(1, `Starting payout broadcast for subjects type: activities`);
      expect(runCall).toHaveBeenNthCalledWith(
        1,
        ["activities"], {
          maxCount: 3, // <-- MAXIMUM 3 BROADCASTS per round
          debug: false,
        } as BroadcastActivityPayoutsCommandOptions
      );
    });
  });
});
