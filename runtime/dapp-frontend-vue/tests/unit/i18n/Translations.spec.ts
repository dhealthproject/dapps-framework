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

describe("Translations class -->", () => {
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
});
