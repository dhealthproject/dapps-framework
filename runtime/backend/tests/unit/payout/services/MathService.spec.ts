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
import { MathService } from "../../../../src/payout/services/MathService";


describe("payout/MathService", () => {
  let mathService: MathService;

  beforeEach(() => {
    mathService = new MathService();
  })

  describe("skewNormal()", () => {
    it("should return correct result if skewness is not defined", () => {
      // prepare
      const [mean, deviation] = [1, 2];
      const getRandomVariatesCall = jest
        .spyOn((mathService as any), "getRandomVariates")
        .mockReturnValue([1,1]);

      // act
      const result = mathService.skewNormal(mean, deviation);

      // assert
      expect(getRandomVariatesCall).toHaveBeenCalledTimes(1);
      expect(result).toBe(3);
    });

    it("should return correct result if skewness is defined", () => {
      // prepare
      const [mean, deviation, skewness] = [1, 2, 2];
      const getRandomVariatesCall = jest
        .spyOn((mathService as any), "getRandomVariates")
        .mockReturnValue([1,1]);
      const mathSqrtCall = jest
        .spyOn(Math, "sqrt")
        .mockReturnValue(2);

      // act
      const result = mathService.skewNormal(mean, deviation, skewness);

      // assert
      expect(getRandomVariatesCall).toHaveBeenCalledTimes(1);
      expect(mathSqrtCall).toHaveBeenCalledTimes(2);
      expect(mathSqrtCall).toHaveBeenNthCalledWith(1, 1 + skewness * skewness);
      expect(mathSqrtCall).toHaveBeenNthCalledWith(2, 0);
      expect(result).toBe(7);
    });
  });
});