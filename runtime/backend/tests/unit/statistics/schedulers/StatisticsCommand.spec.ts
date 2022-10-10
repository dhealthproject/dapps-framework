/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { StateService } from "../../../../src/common/services/StateService";
import { StatisticsCommand, StatisticsCommandOptions } from "../../../../src/statistics/schedulers/StatisticsCommand";


class StatisticsCommandMock extends StatisticsCommand {
  public aggregate(options?: StatisticsCommandOptions): Promise<void> {
    return Promise.resolve();
  }
  protected get command(): string {
    return "StatisticsCommandMock";
  }
  protected get signature(): string {
    return this.command + `D|W|M`;
  }
}

class StateServiceMock extends StateService {}

describe("statistics/StatisticsCommand", () => {
  let service: StatisticsCommand;

  beforeEach(() => {
    service = new StatisticsCommandMock(new StateServiceMock({}, {} as any));
  });

  describe("parseCollection()", () => {
    it("should return correct result", () => {
      // act
      const result = (service as any).parseCollection("test");

      // assert
      expect(result).toBe("test");
    });
  });

  describe("runWithOptions()", () => {
    it("should call aggregate() method", async () => {
      // prepare
      const serviceAggregateCall = jest
        .spyOn(service, "aggregate")
        .mockResolvedValue();
      const options = [
        ["D"],
        {
          debug: true,
          quiet: false,
        }
      ];

      // act
      await (service as any).runWithOptions(
        options
      );

      // assert
      expect(serviceAggregateCall).toHaveBeenNthCalledWith(1, options);
    });
  });
});