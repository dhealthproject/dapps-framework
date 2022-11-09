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
import InfoTip from "@/components/InfoTip/InfoTip.vue";

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
    title: "Test title",
    text: "Test text",
  },
};

describe("InfoTip -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(InfoTip as any, componentOptions);
  });

  it("should exist", () => {
    expect(widget.find(".dapp-info-tip").exists()).to.be.true;
  });

  //   it("should hide tooltip if no hover", () => {
  //     expect(widget.find(".dapp-info-tip__box").attributes().style).to.be.false;
  //   });

  it("should show tooltip on hover", () => {
    expect(widget.find(".dapp-info-tip__box").isVisible()).to.be.true;
  });

  it("should display a title after hover", async () => {
    await widget.trigger("mouseenter");
    expect(widget.find(".title").isVisible()).to.be.true;
  });

  it("should display a text after hover", async () => {
    await widget.trigger("mouseenter");
    expect(widget.find(".text").isVisible()).to.be.true;
  });
});
