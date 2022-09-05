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
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";

// internal dependencies
import DappTokenAmount from "@/fields/DappTokenAmount/DappTokenAmount.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  propsData: {
    value: 0,
  },
};

describe("DappTokenAmount -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappTokenAmount as any, componentOptions);
  });

  it("should display 0 without decimals", () => {
    expect(widget.text()).to.include("0");
  });
});
