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
import { StateDTO } from "../../../../src/common/models/StateDTO";
import { State, StateDocument } from "../../../../src/common/models/StateSchema";

describe("common/StateSchema", () => {
  describe("toQuery()", () => {
    it("should return correct value", () => {
      // prepare
      const name = "test-name";
      const state: State = new State();
      (state as any).name = name;

      // act
      const stateToQuery = state.toQuery;

      // assert
      expect(stateToQuery).toEqual({ name });
    });
  });

  describe("fillDTO()", () => {
    it("should return correct instance", () => {
      // prepare
      const name = "test-name";
      const data = { key: "value" };
      const state = new State();
      (state as any).name = name;
      (state as any).data = data;
      const expectedResult = { name, data };

      // act
      const result = State.fillDTO(state as StateDocument, new StateDTO());

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});