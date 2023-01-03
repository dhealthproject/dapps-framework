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
import AppHeader from "@/components/AppHeader/AppHeader.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
localVue.directive("click-outside", jest.fn());

const getImageUrl = () => "../../../src/assets";

const formatAmount = (amount: number, divisibility: number) => {
  return amount / Math.pow(10, divisibility);
};

const componentOptions = {
  localVue,
  getImageUrl,
  formatAmount,
  stubs: ["router-link"],
  mocks: {
    getImageUrl,
    formatAmount,
    $route: { params: {} },
    $t: jest.fn()
  },
};

describe("AppHeader -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(AppHeader as any, componentOptions);
  });

  it("should exist", () => {
    expect(widget.find(".dapp-screen-header").exists()).to.be.true;
  });
});
