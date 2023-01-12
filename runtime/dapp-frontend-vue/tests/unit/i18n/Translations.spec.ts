/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Tests for Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import { expect } from "chai";
import { Translations } from "@/kernel/i18n/Translations";

describe("Translations -->", () => {
  let instance: Translations;
  beforeEach(() => {
    instance = new Translations();
  });

  it("should have default language en", () => {
    expect(Translations.defaultLanguage).to.be.equal("en");
  });

  it("should provide default language", () => {
    expect(instance.getLanguage()).to.be.not.undefined;
  });

  describe("$t()", () => {
    it("should translate successfully", () => {
      // prepare
      (instance as any).data = {
        en: {
          fake_translation_key: "fake translated value",
        },
      };
      const expectedText = "fake translated value";

      // act
      const result = instance.$t("fake_translation_key");

      // assert
      expect(result).to.be.equal(expectedText);
    });

    it("should accept parameter and map to correct value", () => {
      // prepare
      (instance as any).data = {
        en: {
          fake_translation_key: "fake value with :param",
        },
      };
      const expectedText = "fake value with test";

      // act
      const result = instance.$t("fake_translation_key", { param: "test" });

      // assert
      expect(result).to.be.equal(expectedText);
    });

    it("should accept parameters and map correct values", () => {
      // prepare
      (instance as any).data = {
        en: {
          fake_translation_key: "fake :value with multiple  :param%",
        },
      };
      const expectedText = "fake test1 with multiple  test2%";

      // act
      const result = instance.$t("fake_translation_key", {
        value: "test1",
        param: "test2",
      });

      // assert
      expect(result).to.be.equal(expectedText);
    });
  });
});
