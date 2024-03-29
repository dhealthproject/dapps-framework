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
import ElevateLogo from "@/components/ElevateLogo/ElevateLogo.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const getImageUrl = () => "../../../src/assets";

const componentOptions = {
  localVue,
  getImageUrl,
  stubs: ["router-link"],
  mocks: {
    getImageUrl,
    $route: { params: {} },
  },
  propsData: {
    theme: "dark",
  },
};

describe("ElevateLogo -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(ElevateLogo as any, componentOptions);
  });

  it("should exist", () => {
    expect(widget.find(".dapp-logo").exists()).to.be.true;
  });

  it("should be black if theme = dark", () => {
    expect(widget.vm.fillColor).to.be.equal("#000000");
  });
});
