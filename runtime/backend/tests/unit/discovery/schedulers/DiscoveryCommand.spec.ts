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
import { StateDocument, StateModel, StateQuery } from "../../../../src/common/models/StateSchema";
import { QueryService } from "../../../../src/common/services/QueryService";
import { StateService } from "../../../../src/common/services/StateService";
import { LogService } from "../../../../src/common/services/LogService";
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

  // mocks constructor to provide logger
  public constructor() {
    super(
      {
        setContext: jest.fn(),
        setModule: jest.fn(),
        log: jest.fn(),
        debug: jest.fn(),
        error: jest.fn(),
      } as any, // fake logger
      {
        findOne: jest.fn(),
        updateOne: jest.fn(),
      } as any,  // fake state
    )
  }

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
  let logService: LogService;
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
        MockDiscoveryCommand,
    ]})
    .compile();

    fakeCommand = module.get<MockDiscoveryCommand>(MockDiscoveryCommand);
    stateService = module.get<StateService>(StateService);
    logService = module.get<LogService>(LogService);
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

  describe("getNextSource()", () => {
    // prepare internal method mocks
    let parseSourceMock: any = jest.fn().mockReturnValue({ plain: () => "abc" });

    // we overwrite the `parseSource()` method as this one is
    // tested separately in `DiscoveryCommand`.
    beforeEach(() => {
      // mocks the configService to fake configuration
      (fakeCommand as any).parseSource = parseSourceMock;

      // clear mocks
      parseSourceMock.mockClear();
    });

    it("should correctly parse source input", async () => {
      // act
      const source: string = await (fakeCommand as any).getNextSource(["a", "b"]);

      // assert
      expect(source).toBeDefined();
      expect(source).toBe("abc"); // as mocked
      expect(parseSourceMock).toHaveBeenCalled();
      expect(parseSourceMock).toHaveBeenCalledWith("a");
    });

    it("should read synchronization state with per-source identifier", async () => {
      // act
      const source: string = await (fakeCommand as any).getNextSource(["a", "b"]);

      // assert
      expect((fakeCommand as any).stateService.findOne).toHaveBeenCalled();
      expect((fakeCommand as any).stateService.findOne).toHaveBeenCalledWith(new StateQuery({
        name: `discovery:fake-command:${source}`, // "discovery:DiscoverTransactions:%SOURCE%"
      } as StateDocument));
    });

    it("should loop through available sources", async () => {
      // overwrites parseSource mock as used inside loop
      parseSourceMock = jest.fn()
        .mockReturnValueOnce({ plain: () => "a" })
        .mockReturnValueOnce({ plain: () => "b" });

      // prepare
      (fakeCommand as any).parseSource = parseSourceMock;
      (fakeCommand as any).stateService.findOne = jest.fn().mockReturnValue({
        data: { sync: true },
      });

      // act
      await (fakeCommand as any).getNextSource(["a", "b"]);

      // assert
      expect(parseSourceMock).toHaveBeenCalledTimes(2);
      expect((fakeCommand as any).stateService.findOne).toHaveBeenCalledTimes(2);
      expect((fakeCommand as any).stateService.findOne).toHaveBeenNthCalledWith(1, new StateQuery({
        name: `discovery:fake-command:a`, // "discovery:DiscoverTransactions:%SOURCE%"
      } as StateDocument));
      expect((fakeCommand as any).stateService.findOne).toHaveBeenNthCalledWith(2, new StateQuery({
        name: `discovery:fake-command:b`, // "discovery:DiscoverTransactions:%SOURCE%"
      } as StateDocument));
    });

    describe("given fully synchronized state", () => {
      // overwrites the `parseSource()` mock to return
      // *more than one* discovery source such that
      // the synchronization state can be tested.
      beforeEach(() => {
        parseSourceMock = jest.fn()
          .mockReturnValueOnce({ plain: () => "a" })
          .mockReturnValueOnce({ plain: () => "b" });

        (fakeCommand as any).parseSource = parseSourceMock;

        // also overwrites per-source synchronization state
        // as we want to test fully synchronized discovery
        (fakeCommand as any).stateService.findOne = jest.fn().mockReturnValue({
          data: { sync: true },
        });
      });

      it("should detect fully synchronized state", async () => {
        // prepare
        (fakeCommand as any).state = { data: {} }; // <-- missing "lastUsedAccount"

        // act
        await (fakeCommand as any).getNextSource(["a", "b"]);

        // assert
        expect(parseSourceMock).toHaveBeenCalledTimes(2);
        expect((fakeCommand as any).stateService.findOne).toHaveBeenCalledTimes(2);
      });

      it("should use first source given no general synchronization state", async () => {
        // prepare
        (fakeCommand as any).state = { data: {} }; // <-- missing "lastUsedAccount"

        // act
        const actual: string = await (fakeCommand as any).getNextSource(["a", "b"]);

        // assert
        expect(actual).toBeDefined();
        expect(actual).toBe("a"); // <-- first source
      });

      it("should find last used source and continue with next", async () => {
        // prepare
        (fakeCommand as any).state = {
          data: { lastUsedAccount: "a" }, // <-- forcing state here
        };

        // act
        const actual: string = await (fakeCommand as any).getNextSource(["a", "b"]);

        // assert
        expect(actual).toBeDefined();
        expect(actual).toBe("b"); // <-- next source
      });

      it("should use first source given invalid last used source", async () => {
        // prepare
        (fakeCommand as any).state = {
          data: { lastUsedAccount: "c" }, // <-- forcing state here
        };

        // act
        const actual: string = await (fakeCommand as any).getNextSource(["a", "b"]);

        // assert
        expect(actual).toBeDefined();
        expect(actual).toBe("a"); // <-- first source
      });
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
