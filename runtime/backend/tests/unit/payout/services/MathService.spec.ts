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
  });

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe("skewNormal()", () => {
    it("should return correct result if skewness is not defined", () => {
      const expectedResullts = [3, -4];
      [1, -2.5].forEach((u0: number, index: number) => {
        // prepare
        jest.clearAllMocks();
        const [mean, deviation] = [1, 2];
        const getRandomVariatesCall = jest
          .spyOn((mathService as any), "getRandomVariates")
          .mockReturnValue([u0, 1]);

        // act
        const result = mathService.skewNormal(mean, deviation);

        // assert
        expect(getRandomVariatesCall).toHaveBeenCalledTimes(1);
        expect(result).toBe(expectedResullts[index]);
      });
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

    it("should return correct result if first random variate number is negative", () => {
      const expectedResullts = [0, 3];
      [-1, -2].forEach((u0: number, index: number) => {
        // prepare
        jest.clearAllMocks();
        const [mean, deviation, skewness] = [1, 2, 3];
        const getRandomVariatesCall = jest
          .spyOn((mathService as any), "getRandomVariates")
          .mockReturnValue([u0, 1]);
        const mathSqrtCall = jest
          .spyOn(Math, "sqrt")
          .mockReturnValue(2);

        // act
        const result = mathService.skewNormal(mean, deviation, skewness);

        // assert
        expect(getRandomVariatesCall).toHaveBeenCalledTimes(1);
        expect(mathSqrtCall).toHaveBeenCalledTimes(2);
        expect(mathSqrtCall).toHaveBeenNthCalledWith(1, 1 + skewness * skewness);
        expect(mathSqrtCall).toHaveBeenNthCalledWith(2, 1 - (skewness / 2) * (skewness/ 2));
        expect(result).toBe(expectedResullts[index]);
      });
    });
  });
});