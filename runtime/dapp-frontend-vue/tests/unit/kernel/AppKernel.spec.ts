/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Tests for Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import { AppKernel } from "@/kernel";
import { Module } from "@/kernel";
import { Page } from "@/kernel";
import { expect } from "chai";

// imports the module configuration, card is picked from home.json
import the_module from "../../../config/modules/home.json";

// jest.mock("@dhealth/components", { DappButton: { get: jest.fn(), set: jest.fn() } } as any);
// jest.mock("@/views/Assembler/Assembler.vue", () => ({}));

describe("AppKernel class -->", () => {
  let instance: AppKernel;
  beforeEach(() => {
    instance = AppKernel.getInstance();
  });

  it("should return instance", () => {
    expect(instance).to.be.not.undefined;
  });

  it("should return routes", () => {
    expect(instance.getRoutes().length).to.be.greaterThan(0);
  });

  it("should provide module", () => {
    expect(instance.getModule("home") as Module).to.deep.equal(the_module);
  });

  it("should provide page", () => {
    expect(instance.getPage("home") as Page).to.not.be.undefined;
  });
});
