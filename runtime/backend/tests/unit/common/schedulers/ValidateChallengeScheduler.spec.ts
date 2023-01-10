/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

const jobStartCall = jest.fn();
const jobStopCall = jest.fn();
jest.mock("cron", () => {
  return {
    CronJob: jest.fn().mockImplementation(() => {
      return { start: jobStartCall, stop: jobStopCall };
    }),
  };
});

// external dependencies
import { TestingModule, Test } from "@nestjs/testing";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { getModelToken } from "@nestjs/mongoose";

// internal dependencies
import {
  AuthService,
  AuthenticationPayload,
} from "../../../../src/common/services/AuthService";
import { AccountDocument } from "../../../../src/common/models/AccountSchema";
import { AccountSessionsService } from "../../../../src/common/services/AccountSessionsService";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { MockModel } from "../../../mocks/global";
import { ValidateChallengeScheduler } from "../../../../src/common/schedulers/ValidateChallengeScheduler";

describe("common/ValidateChallengeScheduler", () => {
  let validateChallengeScheduler: ValidateChallengeScheduler;
  let authService: AuthService;
  let configService: ConfigService;
  let logger = {
    setContext: jest.fn(),
    log: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateChallengeScheduler,
        SchedulerRegistry,
        EventEmitter2,
        AuthService,
        AccountsService,
        ConfigService,
        NetworkService,
        AccountSessionsService,
        ChallengesService,
        QueryService,
        JwtService,
        {
          provide: getModelToken("Account"),
          useValue: MockModel,
        }, // requirement from AccountsService
        {
          provide: getModelToken("AuthChallenge"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("AccountSession"),
          useValue: MockModel,
        }, // requirement from AuthService
      ],
    }).compile();

    validateChallengeScheduler = module.get<ValidateChallengeScheduler>(
      ValidateChallengeScheduler,
    );
    authService = module.get<AuthService>(AuthService);
    configService = module.get<ConfigService>(ConfigService);

    (validateChallengeScheduler as any).logger = logger;
  });

  it("should be defined", () => {
    expect(validateChallengeScheduler).toBeDefined();
  });

  describe("constructor()", () => {
    it("should initialize cronjob", () => {
      expect((validateChallengeScheduler as any).job).not.toBe(null);
      expect((validateChallengeScheduler as any).job).not.toBe(undefined);
    });

    it("should add cron to nest registry", () => {
      const mockedFn = jest.fn();

      (validateChallengeScheduler as any).schedulerRegistry = {
        addCronJob: mockedFn,
      };

      new ValidateChallengeScheduler(
        (validateChallengeScheduler as any).schedulerRegistry,
        {} as AuthService,
        {} as AccountsService,
        {} as EventEmitter2,
        configService,
      );

      expect(mockedFn).toBeCalledTimes(1);
    });

    it("should initialize logger", () => {
      expect((validateChallengeScheduler as any).logger).not.toBe(null);
      expect((validateChallengeScheduler as any).logger).not.toBe(undefined);
    });
  });

  describe("startCronJob()", () => {
    it("should start cronjob", () => {
      const mockFn = jest.fn();

      (validateChallengeScheduler as any).job = {
        start: mockFn,
      };

      validateChallengeScheduler.startCronJob("someFakeChallenge");

      expect(mockFn).toBeCalledTimes(1);
    });

    it("should assign argument to challenge prop", () => {
      validateChallengeScheduler.startCronJob("someFakeChallenge");

      expect((validateChallengeScheduler as any).challenge).toBe(
        "someFakeChallenge",
      );
    });

    it("should start stop timeout", () => {
      validateChallengeScheduler.startCronJob("someFakeChallenge");

      expect((validateChallengeScheduler as any).stopCronJobTimeout).not.toBe(
        null,
      );
      expect((validateChallengeScheduler as any).stopCronJobTimeout).not.toBe(
        undefined,
      );
    });
  });

  describe("stopCronJob()", () => {
    it("should stop cronjob", async () => {
      const mockFn = jest.fn();
      (validateChallengeScheduler as any).job = {
        stop: mockFn,
      };

      await (validateChallengeScheduler as any).stopCronJob();

      expect(mockFn).toBeCalledTimes(1);
    });

    it("should reset challenge string", async () => {
      await (validateChallengeScheduler as any).stopCronJob();

      expect((validateChallengeScheduler as any).challenge).toBe("");
    });

    it("should clear stopTimeout", async () => {
      await (validateChallengeScheduler as any).startCronJob();
      await (validateChallengeScheduler as any).stopCronJob();

      expect((validateChallengeScheduler as any).stopCronJobTimeout).not.toBe(
        undefined,
      );
    });
  });

  describe("validate()", () => {
    it("should call validateChallenge", async () => {
      const mockedValidate = jest
        .spyOn(authService, "validateChallenge")
        .mockResolvedValue({} as AuthenticationPayload);

      (validateChallengeScheduler as any).authRegistries = ["fakeRegistry"];

      await (validateChallengeScheduler as any).validate();

      expect(mockedValidate).toBeCalled();
    });

    it("should continue validating given an invalid challenge", async () => {
      (validateChallengeScheduler as any).challenge = "invalidChallenge";
      (validateChallengeScheduler as any).authService = {
        validateChallenge: jest.fn().mockImplementation(
          () => {
            throw new Error("An error occured");
          }, // <-- force-throw
        ),
      };
      const stopCronJobMock = jest.fn();
      (validateChallengeScheduler as any).stopCronJob = stopCronJobMock;

      // act
      await (validateChallengeScheduler as any).validate();

      // assert
      expect(stopCronJobMock).not.toHaveBeenCalled(); // not!
    });

    it("should continue validating given empty authentication payload ", async () => {
      const stopCronJobMock = jest.fn();
      (validateChallengeScheduler as any).stopCronJob = stopCronJobMock;
      jest.spyOn(authService, "validateChallenge").mockResolvedValue(null);

      await (validateChallengeScheduler as any).validate();

      // assert
      expect(stopCronJobMock).not.toHaveBeenCalled(); // not!
    });

    it("should stop cronjob and emit event given successful authentication", async () => {
      // prepare
      const stopCronJobMock = jest.fn();
      const emitMock = jest.fn();
      const getOrCreateForAuthMock = jest.fn().mockResolvedValue({} as AccountDocument);
      (validateChallengeScheduler as any).stopCronJob = stopCronJobMock;
      (validateChallengeScheduler as any).emitter = {
        emit: emitMock,
      };
      (validateChallengeScheduler as any).authRegistries = ["fakeRegistry"];
      (validateChallengeScheduler as any).accountsService = {
        getOrCreateForAuth: getOrCreateForAuthMock,
      };
      jest
        .spyOn(authService, "validateChallenge")
        .mockResolvedValue({} as AuthenticationPayload);

      // act
      await (validateChallengeScheduler as any).validate();

      // assert
      expect(getOrCreateForAuthMock).toHaveBeenCalled();
      expect(emitMock).toHaveBeenCalled();
      expect(stopCronJobMock).toHaveBeenCalled();
    });
  });
});
