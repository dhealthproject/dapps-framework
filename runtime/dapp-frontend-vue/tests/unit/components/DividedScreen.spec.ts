/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Unit Tests
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { expect } from "chai";
import { mount, createLocalVue } from "@vue/test-utils";

// components page being tested
import DividedScreen from "@/components/DividedScreen/DividedScreen.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    $route: { params: {} },
  },
};

describe("DividedScreen -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(DividedScreen as any, componentOptions);
  });

  it("should have 2 columns", () => {
    expect(
      widget.findAll(".dapp-divided-screen__columns__column")
    ).to.have.length(2);
  });
});
