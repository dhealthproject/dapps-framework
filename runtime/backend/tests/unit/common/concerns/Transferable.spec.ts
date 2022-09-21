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

  public static fillDTO(
    doc: any,
    dto: FakeDTO,
  ): FakeDTO {
    dto.address = doc.address;
    return dto;
  }
}

describe("concerns/Transferable", () => {
  let document: FakeSchema;

  beforeEach(() => {
    document = new FakeSchema();
    document.address = "fakeAddress";
  });

  describe("fillDTO()", () => {
    it("should transform into DTO object and keep known fields when called from Transferable", () => {
      // act
      const dto: FakeDTO = Transferable.fillDTO(document, new FakeDTO());

      // assert
      expect(dto).toBeDefined();
      expect("address" in dto).toEqual(true);
      expect(dto.address).toEqual("fakeAddress");
    });

    it("should transform into DTO object and keep known fields when called from class", () => {
      // act
      const dto: FakeDTO = FakeSchema.fillDTO(document, new FakeDTO());

      // assert
      expect(dto).toBeDefined();
      expect("address" in dto).toEqual(true);
      expect(dto.address).toEqual("fakeAddress");
    });

    it("should transform into DTO object and remove unknown fields when called from class", () => {
      // prepare
      (document as any).unknownField = "noValue";

      // act
      const dto: FakeDTO = FakeSchema.fillDTO(document, new FakeDTO());

      // assert
      expect(dto).toBeDefined();
      expect("address" in dto).toEqual(true);
      expect("unknownField" in dto).toEqual(false);
      expect(dto.address).toEqual("fakeAddress");
    });
  });
});
