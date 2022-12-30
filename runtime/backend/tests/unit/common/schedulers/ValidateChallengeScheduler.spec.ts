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
import { TestingModule, Test } from "@nestjs/testing";
import { SchedulerRegistry } from "@nestjs/schedule";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { getModelToken } from "@nestjs/mongoose";

// internal dependencies
import { AuthService } from "../../../../src/common/services/AuthService";
import { NetworkService } from "../../../../src/common/services/NetworkService";
import { AccountsService } from "../../../../src/common/services/AccountsService";
import { ChallengesService } from "../../../../src/common/services/ChallengesService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { MockModel } from "../../../mocks/global";
import { ValidateChallengeScheduler } from "../../../../src/common/schedulers/ValidateChallengeScheduler";

describe("common/ValidateChallengeScheduler", () => {
  let validateChallengeScheduler: ValidateChallengeScheduler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ValidateChallengeScheduler,
        SchedulerRegistry,
        EventEmitter2,
        AuthService,
        ConfigService,
        NetworkService,
        AccountsService,
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
        {} as EventEmitter2,
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
    it("should stop cronjob", () => {
      const mockFn = jest.fn();
      (validateChallengeScheduler as any).job = {
        stop: mockFn,
      };

      (validateChallengeScheduler as any).stopCronJob();

      expect(mockFn).toBeCalledTimes(1);
    });

    it("should reset challenge string", () => {
      (validateChallengeScheduler as any).stopCronJob();

      expect((validateChallengeScheduler as any).challenge).toBe("");
    });

    it("should clear stopTimeout", () => {
      const clearTimeout = jest.fn();
      (validateChallengeScheduler as any).startCronJob();
      (validateChallengeScheduler as any).stopCronJob();

      expect((validateChallengeScheduler as any).stopCronJobTimeout).not.toBe(
        undefined,
      );
    });
  });

  describe("validate()", () => {
    it("should call validateChallenge", () => {
      const mockedValidate = jest.fn();

      (validateChallengeScheduler as any).authService = {
        validateChallenge: mockedValidate,
      };

      (validateChallengeScheduler as any).validate();

      expect(mockedValidate).toBeCalled();
    });

    it("should log error if challenge invalid", () => {
      (validateChallengeScheduler as any).challenge = "invalidChallenge";

      expect((validateChallengeScheduler as any).validate()).toThrowError();
    });

    // it("should stop cronJob", () => {
    //   const mockedFn = jest.fn();
    //   (validateChallengeScheduler as any).stopCronJob = mockedFn;

    //   (validateChallengeScheduler as any).validate();

    //   expect(mockedFn).toBeCalled();
    // });
  });
});
