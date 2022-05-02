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
//import { shallowMount } from "@vue/test-utils";
import { Module } from "../../../src/kernel/index";

// imports the module configuration
import * as the_module from "../../../examples/my-module.json";

describe("Module class -->", () => {
  it("should be castable to Module", () => {
    expect(the_module as Module).to.deep.equal(the_module);
  });

  it("should be compatible with example JSON module", () => {
    expect(the_module.identifier).to.equal("my-module");
  });
});
