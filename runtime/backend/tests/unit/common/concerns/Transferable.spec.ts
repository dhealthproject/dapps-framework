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
import { Transferable } from "../../../../src/common/concerns/Transferable";
import { BaseDTO } from "../../../../src/common/models/BaseDTO";

class FakeDTO extends BaseDTO {
  public address: string;
}

class FakeSchema extends Transferable<FakeDTO> {
  public address: string;
  public get toDTO(): FakeDTO {
    const dto = new FakeDTO();
    dto.address = this.address;
    return dto;
  }
}

describe("concerns/Transferable", () => {
  let document: FakeSchema;

  beforeEach(() => {
    document = new FakeSchema();
    document.address = "fakeAddress";
  });

  describe("toDTO()", () => {
    it("should transform into DTO object and keep known fields", () => {
      // act
      const dto: FakeDTO = document.toDTO;

      // assert
      expect(dto).toBeDefined();
      expect("address" in dto).toEqual(true);
      expect(dto.address).toEqual("fakeAddress");
    });

    it("should transform into DTO object and remove unknown fields", () => {
      // prepare
      (document as any).unknownField = "noValue";

      // act
      const dto: FakeDTO = document.toDTO;

      // assert
      expect(dto).toBeDefined();
      expect("address" in dto).toEqual(true);
      expect("unknownField" in dto).toEqual(false);
      expect(dto.address).toEqual("fakeAddress");
    });
  });
});
