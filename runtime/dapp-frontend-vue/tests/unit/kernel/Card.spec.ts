/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Tests for Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import { Card } from "@/kernel";
import { expect } from "chai";

// imports the module configuration, card is picked from home.json
import the_module from "../../../config/modules/home.json";

describe("Card class -->", () => {
  let card: any;
  beforeEach(() => {
    card = the_module.routerConfig["/"].cards[0];
  });

  it("should exist", () => {
    expect(card).to.be.not.undefined;
  });

  it("should be compatible with card example", () => {
    expect(card as Card).to.deep.equal(card);
  });

  it("should be compatible with example JSON card", () => {
    expect(card.identifier).to.be.equal("title-message");
  });
});
