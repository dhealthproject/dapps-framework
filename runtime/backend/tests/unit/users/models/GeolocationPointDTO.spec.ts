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
import { GeolocationDTO } from "../../../../src/users/models/GeolocationDTO";
import { GeolocationPointDTO } from "../../../../src/users/models/GeolocationPointDTO";

describe("users/GeolocationPointDTO", () => {
  describe("constructor()", () => {
    it("should create correct instance", () => {
      // act
      const result = new GeolocationPointDTO();

      // assert
      expect(result).toBeInstanceOf(GeolocationDTO);
      expect(result).toBeInstanceOf(GeolocationPointDTO);
    })
  });
});