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
import { ReportNotifierCommand } from "../../../../../src/notifier/schedulers/ReportNotifier/ReportNotifierCommand";
import { DailyReportNotifier } from "../../../../../src/notifier/schedulers/ReportNotifier/DailyReportNotifier";
import { WeeklyReportNotifier } from "../../../../../src/notifier/schedulers/ReportNotifier/WeeklyReportNotifier";
import { MonthlyReportNotifier } from "../../../../../src/notifier/schedulers/ReportNotifier/MonthlyReportNotifier";


describe("notifier/ReportNotifierCommand", () => {
  describe("static getNotifierClass()", () => {
    it("should return correct class for each period format", () => {
      const periodFormats = ["", "D", "W", "M"];
      const expectedResult = [MonthlyReportNotifier, DailyReportNotifier, WeeklyReportNotifier, MonthlyReportNotifier];
      periodFormats.forEach((periodFormat: string, index: number) => {
        // act
        const result = (ReportNotifierCommand as any).getNotifierClass(periodFormat);

        // assert
        expect(result).toBe(expectedResult[index]);
      });
    });
  });
});