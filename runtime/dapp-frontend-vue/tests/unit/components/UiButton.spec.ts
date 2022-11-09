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
import UiButton from "@/components/UiButton/UiButton.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const getImageUrl = () => "../../../src/assets";

const componentOptions = {
  localVue,
  getImageUrl,
  stubs: ["router-link"],
  mocks: {
    getImageUrl,
    formatAddress: jest.fn(() => "NATZJE...2GY"),
    $route: { params: {} },
    $t: jest.fn(),
  },
  propsData: {
    accent: true,
  },
};

describe("UiButton -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(UiButton as any, componentOptions);
  });

  it("should exist", () => {
    expect(widget.find(".dapp-ui-button").exists()).to.be.true;
  });

  it("should not be a link without :to prop defined", () => {
    expect(widget.find(".dapp-ui-button__link").exists()).to.be.false;
  });

  it("should not be disabled without prop defined", () => {
    expect(widget.find(".disabled").exists()).to.be.false;
  });

  it("should be accent", () => {
    expect(widget.find(".accent").exists()).to.be.true;
  });

  it("should emit click", async () => {
    widget.find("button").trigger("click");
    await widget.vm.$nextTick();
    expect(widget.emitted()["click"][0]);
  });
});
