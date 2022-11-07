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
import { PaginatedResultDTO } from "../../../../src/common/models/PaginatedResultDTO";

describe("common/PaginatedResultDTO", () => {
  describe("constructor()", () => {
    it("should create instance with correct fields", () => {
      // prepare
      const data = ["data"];
      const pagination = {
        pageNumber: -1,
        pageSize: -1,
        total: 1,
      }

      // act
      const paginatedResultDto = new PaginatedResultDTO(
        data,
        pagination,
      );

      // assert
      expect(paginatedResultDto.pagination.pageNumber).toEqual(1);
    });

    it("should create with default pagination values", () => {
      // prepare
      const data = ["data1", "data2"];

      // act
      const paginatedResultDto = new PaginatedResultDTO(data, null);

      // assert
      expect(paginatedResultDto.pagination.pageNumber).toEqual(1);
      expect(paginatedResultDto.pagination.pageSize).toEqual(100);
      expect(paginatedResultDto.pagination.total).toEqual(2);
    });
  });

  describe("isLastPage()", () => {
    it("should return correct result", () => {
      // prepare
      const data = ["data1", "data2", "data3"];
      const expectedResult = [true, true, true, false, true, false, true];
      [
        { pageNumber: 3, pageSize: 1, total: 3 },
        { pageNumber: 2, pageSize: 3, total: 3 },
        { pageNumber: 2, pageSize: 3, total: null },
        { pageNumber: 2, pageSize: 1, total: 3 },
        { pageNumber: 0, pageSize: 5, total: 3 },
        { pageNumber: 1, pageSize: 2, total: 3 },
        { pageNumber: 1, pageSize: 7, total: 3 },
      ].forEach((pagination, index) => {
        // act
        const paginatedResultDto = new PaginatedResultDTO(data, pagination);
        if (index === 2) {
          paginatedResultDto.pagination.total = null;
        }

        // assert
        expect(paginatedResultDto.isLastPage()).toEqual(expectedResult[index]);
      });
    });
  });
});