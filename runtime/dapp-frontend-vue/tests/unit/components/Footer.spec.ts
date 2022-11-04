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
import Footer from "@/components/Footer/Footer.vue";

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
    layout: "empty",
    links: () => [
      { path: "terms-and-conditions", text: "Terms & Conditions" },
      { path: "privacy-policy", text: "Privacy Policy" },
    ],
  },
};

describe("Footer -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(Footer as any, componentOptions);
  });

  it("should exist", () => {
    expect(widget.find(".dapp-screen-footer").exists()).to.be.true;
  });

  it("should display layout with empty variant", () => {
    expect(widget.find(".dapp-screen-footer__empty").exists()).to.be.true;
  });

  it("should not display layout with any other variant", () => {
    expect(widget.find(".dapp-screen-footer__default").exists()).to.be.false;
  });

  it("should display correct year", () => {
    expect(widget.find(".dapp-screen-footer__empty__copy").text()).includes(
      new Date().getFullYear()
    );
  });

  it("should contain links based on prop", () => {
    expect(widget.findAll(".link")).to.have.length(
      widget.props("links").length
    );
  });
});
