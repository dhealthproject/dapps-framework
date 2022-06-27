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
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import type { Scope } from "../../../src/common/models/Scope";
import { QueryService } from "../../../src/common/services/QueryService";
import { StateService } from "../../../src/common/services/StateService";
import { StateDocument, StateQuery } from "../../../src/common/models/StateSchema";
import { BaseCommand, BaseCommandOptions } from "../../../src/worker/BaseCommand";

// Mocks a base command **child** class to implement
// abstract methods as defined in `BaseCommand`.
class MockBaseCommand extends BaseCommand {
  protected scope: Scope = "discovery";
  protected get command(): string { return "fake-command"; }
  protected get signature(): string { return "fake-command --source TARGET_ACCOUNT"; }
  protected async runWithOptions(
    options: BaseCommandOptions,
  ): Promise<void> {}

  // mocks the internal StateService
  protected stateService: any = { findOne: jest.fn() };

  // mocks a fake method to test arguments storage
  public getArgv(): string[] { return this.argv; }

  // mocks the internal getStateQuery method for access
  public getStateQuery(): StateQuery { return super.getStateQuery(); }
}

// Mocks another base command **child** class to test
// processed of error handling as defined in `BaseCommand`.
class MockFailingBaseCommand extends MockBaseCommand {
  protected async runWithOptions(
    options: BaseCommandOptions,
  ): Promise<void> {
    throw new Error("Something went wrong.");
  }
}

// Mocks a base model class such that queries using
// the StateService can be fulfilled and tracked.
class MockModel {
  static findOne = jest.fn(() => ({ exec: () => ({}) }));
  static findOneAndUpdate = jest.fn(() => ({ exec: () => ({}) }));
}

describe("worker/BaseCommand -->", () => {
  // global injectable service setup
  let fakeCommand: MockBaseCommand;
  let stateService: StateService;
  let queryService: QueryService<StateDocument>;

  // each test gets its own TestingModule (injectable)
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QueryService,
        StateService,
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
        MockBaseCommand,
    ]})
    .compile();

    fakeCommand = module.get<MockBaseCommand>(MockBaseCommand);
    stateService = module.get<StateService>(StateService);
    queryService = module.get<QueryService<StateDocument>>(QueryService);
  });

  // testing internals
  describe("usage()", () => {
    it("should return command signature", () => {
      // act+assert
      expect(fakeCommand.usage()).toBe(`fake-command --source TARGET_ACCOUNT`);
    });
  });

  describe("stateIdentifier()", () => {
    it("should return scope with command name", () => {
      // act+assert
      expect(fakeCommand.stateIdentifier).toBe(`discovery:fake-command`);
    });
  });

  describe("run()", () => {
    it("should define and copy call arguments", async () => {
      // act
      await fakeCommand.run([], { debug: true });
      // assert
      expect(fakeCommand.getArgv()).toBeDefined();
    });

    it("should print debug information given debug mode", async () => {
      // prepare
      (fakeCommand as any).debugLog = jest.fn();
      // act
      await fakeCommand.run([], { debug: true });
      // assert
      expect((fakeCommand as any).debugLog).toHaveBeenCalled();
    });

    it("should not print debug information given quiet mode", async () => {
      // prepare
      (fakeCommand as any).debugLog = jest.fn();
      // act
      await fakeCommand.run([], { debug: true, quiet: true });
      // assert
      expect((fakeCommand as any).debugLog).not.toHaveBeenCalled(); // not!
    });

    it("should not print debug information given disabled debug mode", async () => {
      // prepare
      (fakeCommand as any).debugLog = jest.fn();
      // act
      await fakeCommand.run([], { debug: false });
      // assert
      expect((fakeCommand as any).debugLog).not.toHaveBeenCalled(); // not!
    });

    it("should print error information given failing runWithOptions", async () => {
      // prepare: creates another testing module (`MockFAILING`)
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          QueryService,
          StateService,
          {
            provide: getModelToken("State"),
            useValue: MockModel,
          },
          MockFailingBaseCommand,
      ]})
      .compile();
      fakeCommand = module.get<MockFailingBaseCommand>(MockFailingBaseCommand);

      // prepare: overwrites the `errorLog` method for spying
      (fakeCommand as any).errorLog = jest.fn();

      // act
      await fakeCommand.run([], { debug: true });

      // assert
      expect((fakeCommand as any).errorLog).toHaveBeenCalled();
    });

    it("should call stateService.findOne to read current state", async () => {
      // act
      await fakeCommand.run([], {});
      // assert
      expect((fakeCommand as any).stateService.findOne).toHaveBeenCalled();
      expect((fakeCommand as any).stateService.findOne).toHaveBeenCalledWith(
        fakeCommand.getStateQuery()
      );
    });

    it("should call runWithOptions and pass correct options", async () => {
      // prepare
      (fakeCommand as any).runWithOptions = jest.fn();
      // act
      await fakeCommand.run([], { debug: true });
      // assert
      expect((fakeCommand as any).runWithOptions).toHaveBeenCalled();
      expect((fakeCommand as any).runWithOptions).toHaveBeenCalledWith(
        { debug: true }
      );
    });
  });
});
