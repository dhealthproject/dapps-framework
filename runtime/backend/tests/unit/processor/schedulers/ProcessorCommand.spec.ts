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
import { MockModel } from "../../../mocks/global";
import { StateService } from "../../../../src/common/services/StateService";
import { ProcessorCommand, ProcessorCommandOptions } from "../../../../src/processor/schedulers/ProcessorCommand";
import { QueryService } from "../../../../src/common/services/QueryService";
import { LogService } from "../../../../src/common/services/LogService";

class TestProcessorCommand extends ProcessorCommand {
  public process(options?: ProcessorCommandOptions): Promise<void> {
    return;
  }
  protected get command(): string {
    return "test-command";
  }
  protected get signature(): string {
    return "test-signature";
  }
}

describe("processor/ProcessorCommand", () => {
  let processorCommand: ProcessorCommand;
  let statesService: StateService;
  let logService: LogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StateService,
        QueryService,
        LogService,
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
      ]
    }).compile();

    statesService = module.get<StateService>(StateService);
    logService = module.get<LogService>(LogService);
    processorCommand = new TestProcessorCommand(logService, statesService);
  });

  describe("parseCollection()", () => {
    it("should return correct result", () => {
      // prepare
      const collectionOptions = "test-collectionOptions";

      // act
      const result = (processorCommand as any).parseCollection(collectionOptions);

      // assert
      expect(result).toBe(collectionOptions);
    });
  });

  describe("runWithOptions()", () => {
    it("should call correct method", async () => {
      // prepare
      const processCall = jest
        .spyOn(processorCommand, "process")
        .mockResolvedValue();
      const options = "test-options";

      // act
      await (processorCommand as any).runWithOptions(options);

      // assert
      expect(processCall).toHaveBeenNthCalledWith(1, options);
    });
  });
});