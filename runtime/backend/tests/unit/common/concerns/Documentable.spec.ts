/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// mock mongoose's Document class
class TestDocument {}
jest.mock("mongoose", () => {
  return { Document: TestDocument };
});

// internal dependencies
import { Documentable } from "../../../../src/common/concerns/Documentable";

describe("common/Documentable", () => {
  let document: Documentable;

  beforeEach(() => {
    document = new Documentable();
    document._id = "testID";
  });

  describe("toQuery()", () => {
    it("should return correct result", () => {
      // prepare
      const expectedResult = { id: document._id };

      // act
      const result = document.toQuery;

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});