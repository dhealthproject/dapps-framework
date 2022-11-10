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
import { QueryService } from "../../../../src/common/services/QueryService";
import { PayoutCommand, PayoutCommandOptions } from "../../../../src/payout/schedulers/PayoutCommand";

class TestPayoutCommand extends PayoutCommand {
  public execute(options?: PayoutCommandOptions): Promise<void> {
    return;
  }
  protected get command(): string {
    return "test-command";
  }
  protected get signature(): string {
    return "test-signature";
  }
}

describe("payout/PayoutCommand", () => {
  let payoutCommand: PayoutCommand;
  let statesService: StateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StateService,
        QueryService,
        {
          provide: getModelToken("State"),
          useValue: MockModel,
        },
      ]
    }).compile();

    statesService = module.get<StateService>(StateService);
    payoutCommand = new TestPayoutCommand(statesService);
  });

  describe("runWithOptions()", () => {
    it("should call correct method", async () => {
      // prepare
      const executeMock = jest
        .spyOn(payoutCommand, "execute")
        .mockResolvedValue();
      const options = "test-options";

      // act
      await (payoutCommand as any).runWithOptions(options);

      // assert
      expect(executeMock).toHaveBeenNthCalledWith(1, options);
    });
  });
});