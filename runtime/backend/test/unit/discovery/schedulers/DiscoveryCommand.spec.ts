/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// import overwrites for @dhealth/sdk
const MockPublicAccount = jest.fn().mockReturnValue({
  address: jest.fn(),
});
const MockAddress = jest.fn();
jest.mock("@dhealth/sdk", () => ({
  PublicAccount: { createFromPublicKey: MockPublicAccount },
  Address: { createFromRawAddress: MockAddress },
}));

// external dependencies
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Address } from "@dhealth/sdk";

// internal dependencies
import type { Scope } from "../../../../src/common/models/Scope";
import { DappConfig } from "../../../../src/common/models/DappConfig";
import { NetworkConfig } from "../../../../src/common/models/NetworkConfig";
import { StateDocument } from "../../../../src/common/models/StateSchema";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { DiscoveryCommand, DiscoveryCommandOptions } from "../../../../src/discovery/schedulers/DiscoveryCommand";

// configuration resources
import dappConfigLoader from "../../../../config/dapp";
import networkConfigLoader from "../../../../config/network";

// Mocks a discovery command **child** class to implement
// abstract methods as defined in `DiscoveryCommand`.
class MockDiscoveryCommand extends DiscoveryCommand {
  protected scope: Scope = "discovery";
  protected get command(): string { return "fake-command"; }
  protected get signature(): string { return "fake-command --source TARGET_ACCOUNT"; }

  // mocks a fake discovery method to test processes
  public async discover(options?: DiscoveryCommandOptions): Promise<void> {}

  // mocks a real public getter to test network configuration
  public getNetworkConfig(): NetworkConfig { return this.networkConfig; }

  // mocks a real public parser to test its internals
  public parseSource(source: string): Address { return super.parseSource(source); }

  // mocks a real public runner to test its internals
  public async runWithOptions(options: any): Promise<void> { return super.runWithOptions(options); }
}

// Mocks a base model class such that queries using
// the StateService can be fulfilled and tracked.
class MockModel {
  static findOne = jest.fn(() => ({ exec: () => ({}) }));
  static findOneAndUpdate = jest.fn(() => ({ exec: () => ({}) }));
}

describe("discovery/DiscoveryCommand -->", () => {
  // global injectable service setup
  let fakeCommand: MockDiscoveryCommand;
  let stateService: StateService;
  let queryService: QueryService<StateDocument>;
  let expectedNetworkConfig: NetworkConfig = networkConfigLoader();
  let expectedDappConfig: DappConfig = dappConfigLoader();

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
        MockDiscoveryCommand,
    ]})
    .compile();

    fakeCommand = module.get<MockDiscoveryCommand>(MockDiscoveryCommand);
    stateService = module.get<StateService>(StateService);
    queryService = module.get<QueryService<StateDocument>>(QueryService);

    // clears mocks calls
    MockPublicAccount.mockClear();
    MockAddress.mockClear();
  });

  // testing internals
  describe("parseSource()", () => {
    it("should use correct network identifier", () => {
      // act+assert
      expect(fakeCommand.getNetworkConfig().network.networkIdentifier).toBe(
        expectedNetworkConfig.network.networkIdentifier,
      );
    });

    it("should use PublicAccount class given a public key", () => {
      // act
      fakeCommand.parseSource(
        "7A709A0AABE1BEC07667F227EC40499BD6B95A8C2D90848C02599DBC4A226B3A",
      );
      // assert
      expect(MockPublicAccount).toHaveBeenCalled();
      expect(MockPublicAccount).toHaveBeenCalledWith(
        "7A709A0AABE1BEC07667F227EC40499BD6B95A8C2D90848C02599DBC4A226B3A", 104
      );
    });

    it("should use Address class given a different input", () => {
      // act
      fakeCommand.parseSource(
        "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
      );
      // assert
      expect(MockPublicAccount).not.toHaveBeenCalled(); // not!
      expect(MockAddress).toHaveBeenCalled();
    });

    it("should use fallback given invalid source input", () => {
      // act
      fakeCommand.parseSource(
        "This is not a valid source",
      );
      // assert
      expect(MockPublicAccount).toHaveBeenCalled();
      expect(MockPublicAccount).toHaveBeenCalledWith(
        expectedDappConfig.dappPublicKey, 104
      );
    });
  });

  describe("runWithOptions()", () => {
    it("should set the discovery source before execution", async () => {
      // act
      await fakeCommand.runWithOptions({
        source: "7A709A0AABE1BEC07667F227EC40499BD6B95A8C2D90848C02599DBC4A226B3A"
      });
      // assert
      expect((fakeCommand as any).discoverySource).toBeDefined();
    });

    it("should call discover upon setting discovery source", async () => {
      // prepare
      (fakeCommand as any).discover = jest.fn();
      const expectedOptions: DiscoveryCommandOptions = {
        source: "7A709A0AABE1BEC07667F227EC40499BD6B95A8C2D90848C02599DBC4A226B3A"
      };

      // act
      await fakeCommand.runWithOptions(expectedOptions);

      // assert
      expect((fakeCommand as any).discoverySource).toBeDefined();
      expect((fakeCommand as any).discover).toHaveBeenCalled();
      expect((fakeCommand as any).discover).toHaveBeenCalledWith(expectedOptions);
    });
  });
});
