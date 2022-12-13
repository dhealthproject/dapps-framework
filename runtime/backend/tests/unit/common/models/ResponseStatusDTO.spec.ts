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
import { ResponseStatusDTO } from "../../../../src/common/models/ResponseStatusDTO";

describe("common/ResponseStatusDTO", () => {
  describe("get data()", () => {
    it("should return response data if it's available", () => {
      // prepare
      const expectedResult = "test-data";
      const responseStatusDTO = new ResponseStatusDTO();
      responseStatusDTO.response = {
        data: expectedResult
      };

      // act
      const result = responseStatusDTO.data;

      // assert
      expect(result).toEqual(expectedResult);
    });

    it("should return response untouched if its data is not available", () => {
      // prepare
      const expectedResult = { response: "test-response" };
      const responseStatusDTO = new ResponseStatusDTO();
      responseStatusDTO.response = expectedResult;

      // act
      const result = responseStatusDTO.data;

      // assert
      expect(result).toEqual(expectedResult);
    });
  });

  describe("create()", () => {
    it("should create correctly", () => {
      [ undefined, { response: "test-response" } ].forEach(responseValue => {
        // prepare
        const code = 200;
        const status = true;
        const response = responseValue;
        const expectedResult = new ResponseStatusDTO();
        expectedResult.code = code;
        expectedResult.status = status;
        expectedResult.response = response ? response : {};

        // act
        const result = ResponseStatusDTO.create(code, response);

        // assert
        expect(result).toEqual(expectedResult);
      });
    });
  });
});