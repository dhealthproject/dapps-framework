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
const axiosMock = {
  get: jest.fn(),
  post: jest.fn()
}

// mock axios instance
jest.mock("axios", () => axiosMock);
import { HttpRequestHandler } from "../../../../src/common/drivers/HttpRequestHandler";

describe("common/HttpRequestHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("call()", () => {
    it("should throw correct error", () => {
      // prepare
      const httpRequestHandler = new HttpRequestHandler();
      const expectedError = new Error("test error");
      const getCall = jest
        .spyOn(axiosMock, "get")
        .mockImplementation(() => { throw expectedError })

      // act
      const actionCall = httpRequestHandler.call(
        "test.url"
      )

      // assert
      expect(actionCall).rejects.toEqual(expectedError);
      expect(getCall).toBeCalledTimes(1);
    });

    it("should return correct result for GET", async () => {
      // prepare
      const httpRequestHandler = new HttpRequestHandler();
      const expectedResult = { success: true };
      const getCall = jest
        .spyOn(axiosMock, "get")
        .mockResolvedValue(expectedResult);

      // act
      const result = await httpRequestHandler.call(
        "test.url"
      )

      // assert
      expect(getCall).toBeCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });

    it("should return correct result for POST", async () => {
      // prepare
      const httpRequestHandler = new HttpRequestHandler();
      const expectedResult = { success: true };
      const postCall = jest
        .spyOn(axiosMock, "post")
        .mockResolvedValue(expectedResult);

      // act
      const result = await httpRequestHandler.call(
        "test.url",
        "POST",
      )

      // assert
      expect(postCall).toBeCalledTimes(1);
      expect(result).toEqual(expectedResult);
    });
  });
});