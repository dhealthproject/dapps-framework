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
import { Statistics } from "../../../../src/statistics/models/StatisticsSchema";

describe("statistics/StatisticsSchema", () => {
  describe("get toQuery()", () => {
    it("should return correct database query", () => {
      // prepare
      const statistics: Statistics = new Statistics();
      (statistics as any).type = "fake-type";
      (statistics as any).periodFormat = "fake-periodFormat";
      (statistics as any).period = "fake-period";
      (statistics as any).address = "fake-address";
      (statistics as any).position = 1;
      (statistics as any).amount = 100;

      // act
      const statisticsToQuery = statistics.toQuery;

      // assert
      expect("period" in statisticsToQuery).toBe(true);
      expect("address" in statisticsToQuery).toBe(true);
      expect("position" in statisticsToQuery).toBe(true);
      expect(statisticsToQuery.period).toBe(statistics.period);
      expect(statisticsToQuery.address).toBe(statistics.address);
      expect(statisticsToQuery.position).toBe(statistics.position);
    });
  });
});