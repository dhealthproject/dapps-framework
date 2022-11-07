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
// These following mocks are used in this unit test series.
// Mocks a subset of "@dhealth/sdk" including classes:
// - PublicAccount to return a valid Address
// - Address to always return a formattable valid Address
jest.mock("@dhealth/sdk", () => ({
  PublicAccount: {
    createFromPublicKey: (pk: string, n: number) => ({ address: { plain: () => "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY" } }),
  },
  Address: {
    createFromRawAddress: (a: string) => ({ plain: () => "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY" }),
  }
}));

// external dependencies
import { Address, PublicAccount } from "@dhealth/sdk"; // mocked!
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import type { Scope } from "../../../../src/common/models/Scope";
import { DappConfig } from "../../../../src/common/models/DappConfig";
import { NetworkConfig } from "../../../../src/common/models/NetworkConfig";
import { StateDocument, StateModel } from "../../../../src/common/models/StateSchema";
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

  // mocks a real public runner to test its internals
  public async runWithOptions(options: any): Promise<void> { return super.runWithOptions(options); }
}

// Offers an implementation to avoid "undefined"
// when used directly in classes tested here.
PublicAccount.createFromPublicKey = jest.fn().mockReturnValue({ address: { plain: () => "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY" } });
Address.createFromRawAddress = jest.fn().mockReturnValue({ plain: () => "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY" });

describe("discovery/DiscoveryCommand", () => {
  // global injectable service setup
  let fakeCommand: MockDiscoveryCommand;
  let stateService: StateService;
  let queryService: QueryService<StateDocument, StateModel>;
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
    queryService = module.get<QueryService<StateDocument, StateModel>>(QueryService);

    // clears mocks calls
    // MockPublicAccount.mockClear();
    // MockAddress.mockClear();
  });

  it("should be defined", () => {
    expect(fakeCommand).toBeDefined();
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
      const actual: Address = (fakeCommand as any).parseSource(
        "7A709A0AABE1BEC07667F227EC40499BD6B95A8C2D90848C02599DBC4A226B3A",
      );

      // assert
      expect(actual.plain()).toBe("NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY");
    });

    it("should use Address class given a different input", () => {
      // act
      const actual: Address = (fakeCommand as any).parseSource(
        "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
      );

      // assert
      expect(actual.plain()).toBe("NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY");
    });

    it("should use fallback given invalid source input", () => {
      // act
      const actual: Address = (fakeCommand as any).parseSource(
        "This is not a valid source",
      );

      // assert
      expect(actual.plain()).toBe("NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY");
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
