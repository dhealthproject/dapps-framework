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
    it("should return correct response.data if it exists", () => {
      // prepare
      const responseStatusDTO: ResponseStatusDTO = ResponseStatusDTO.create(
        200,
        {
          data: "test-data",
        }
      );

      // act
      const result = responseStatusDTO.data;

      // assert
      expect(result).toBe(responseStatusDTO.response.data);
    });

    it("should return correct response if response.data doesn't exist", () => {
      // prepare
      const responseStatusDTO: ResponseStatusDTO = ResponseStatusDTO.create(
        200,
        {
          field: "value",
        }
      );

      // act
      const result = responseStatusDTO.data;

      // assert
      expect(result).toBe(responseStatusDTO.response);
    });
  });

  describe("create()", () => {
    it("should have response as empty object by default if not provided", () => {
      // act
      const result = ResponseStatusDTO.create(200);

      // assert
      expect(result.response).toEqual({});
    });
  });
});