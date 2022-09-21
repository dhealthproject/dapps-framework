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
import { Documentable } from "../../../../src/common/concerns/Documentable";
import { Queryable } from "../../../../src/common/concerns/Queryable";

class FakeSchema {
  _id: string = "test-id";
  key: string;
  get toQuery() {
    return { id: this._id }
  };
}

type FakeSchemaDocument = FakeSchema & Documentable;

describe("concerns/Queryable", () => {
  describe("get() -->", () => {
    it("should return undefined", () => {
      // prepare
      const queryable = new Queryable<FakeSchemaDocument>();

      // act
      const getQuery = queryable.getDocument();

      // assert
      expect(getQuery).toBeUndefined();
    });

    it("should return correct document", () => {
      // prepare
      const fakeSchemaDocument = { key: "test-value" } as FakeSchemaDocument;
      const queryable = new Queryable<FakeSchemaDocument>(fakeSchemaDocument);

      // act
      const getQuery = queryable.getDocument();

      // assert
      expect(getQuery).toEqual(fakeSchemaDocument);
    });
  });

  describe("set() -->", () => {
    it("should sucessfully set document instance", () => {
      // prepare
      const fakeSchemaDocument = { key: "test-value" } as FakeSchemaDocument;
      const queryable = new Queryable<FakeSchemaDocument>();

      // act
      const setQuery = queryable.setDocument(fakeSchemaDocument);

      // assert
      expect(setQuery.document).toEqual(fakeSchemaDocument);
    });
  });

  describe("forDocument() -->", () => {
    it("should return correct result", () => {
      // prepare
      const fakeSchemaDocument = new FakeSchema() as FakeSchemaDocument;

      // act
      const queryable = new Queryable<FakeSchemaDocument>(fakeSchemaDocument);
      const toQuery = queryable.forDocument();

      // assert
      expect(toQuery).toEqual({ id: "test-id" });
    });
  });
});