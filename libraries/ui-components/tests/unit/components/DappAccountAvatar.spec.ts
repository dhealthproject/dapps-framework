/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Unit Tests
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { expect } from "chai";
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import DappAccountAvatar from "@/graphics/DappAccountAvatar/DappAccountAvatar.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  propsData: {
    address: "test-address",
  },
};

describe("DappAccountAvatar -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappAccountAvatar as any, componentOptions);
  });

  it("should have correct default props", () => {
    expect(widget.props().width).to.equals(261.333);
    expect(widget.props().height).to.equals(131.313);
    expect(widget.props().hideCaption).to.be.false;
  });

  it("should have correct default attributes", () => {
    expect(widget.attributes().width).to.equals("261.333");
    expect(widget.attributes().height).to.equals("131.313");
    expect(widget.attributes().viewBox).to.equals("0 0 261.333 131.313");
  });

  it("should have correct attributes from props", () => {
    const componentOptions = {
      localVue,
      propsData: {
        address: "test-address",
        width: 100,
        height: 200,
      },
    };
    widget = shallowMount(DappAccountAvatar as any, componentOptions);
    expect(widget.attributes().width).to.equals("100");
    expect(widget.attributes().height).to.equals("200");
    expect(widget.attributes().viewBox).to.equals("0 0 261.333 131.313");
  });

  it("should have correct viewBox attribute & should not display `text` element when `hideCaption` prop is true", () => {
    const componentOptions = {
      localVue,
      propsData: {
        address: "test-address",
        hideCaption: true,
      },
    };
    widget = shallowMount(DappAccountAvatar as any, componentOptions);
    expect(widget.findAll("text").length).to.equal(0);
    expect(widget.attributes().viewBox).to.equals("115 0 16 105");
  });

  it("should display address in truncate form in `text` element", () => {
    expect(widget.find("text").text()).to.equals("test...ress");
  });

  it("should display address in full form in `title` element", () => {
    expect(widget.find("title").text()).to.equals("address: test-address");
  });

  it("should contain 10 `path` elements", () => {
    expect(widget.findAll("path").length).to.equals(10);
  });

  it("should have correct css classes", () => {
    expect(widget.find("svg").classes().includes("dapp-account-avatar-account"))
      .to.be.true;
    expect(
      widget.find("text").classes().includes("dapp-account-avatar-account-text")
    ).to.be.true;
  });
});
