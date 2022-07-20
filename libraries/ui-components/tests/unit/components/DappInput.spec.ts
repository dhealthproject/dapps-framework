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
import { createLocalVue, mount, shallowMount, Wrapper } from "@vue/test-utils";
import DappInput from "@/fields/DappInput/DappInput.vue";
import DappIcon from "@/graphics/DappIcon/DappIcon.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  propsData: {
    inputValue: "test value",
    placeholder: "test placeholder",
    leftIconSrc: "test leftIconSrc",
    rightIconSrc: "test rightIconSrc",
  },
};

describe("DappInput -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappInput as any, componentOptions);
  });

  it("should have correct prop values", () => {
    widget = shallowMount(DappInput as any, {
      ...componentOptions,
      propsData: {
        inputValue: "test value",
        placeholder: "test placeholder",
        leftIconSrc: "test leftIconSrc",
        rightIconSrc: "test rightIconSrc",
        disabled: true,
      },
    });
    expect(widget.props().inputValue).to.equals("test value");
    expect(widget.props().placeholder).to.equals("test placeholder");
    expect(widget.props().leftIconSrc).to.equals("test leftIconSrc");
    expect(widget.props().rightIconSrc).to.equals("test rightIconSrc");
    expect(widget.props().disabled).to.be.true;
  });

  it("should have correct default prop value", () => {
    expect(widget.props().disabled).to.be.false;
  });

  it("should render correct elements with correct attributes & classes", () => {
    widget = mount(DappInput as any, componentOptions);
    const mainDivElement = widget.find("div");
    const inputDivElement = mainDivElement.find("div");
    const dappIconElements = inputDivElement.findAllComponents(DappIcon);
    const inputElement = inputDivElement.find("input");
    expect(mainDivElement.exists()).to.be.true;
    expect(inputDivElement.exists()).to.be.true;
    expect(dappIconElements.length === 2).to.be.true;
    expect(dappIconElements.at(0).classes()).to.include("dappInput-icon-left");
    expect(dappIconElements.at(0).attributes().src).to.equals(
      "test leftIconSrc"
    );
    expect(dappIconElements.at(1).classes()).to.include("dappInput-icon-right");
    expect(dappIconElements.at(1).attributes().src).to.equals(
      "test rightIconSrc"
    );
    expect(inputElement.exists()).to.be.true;
    expect(inputElement.classes()).to.include("dappInput-input");
    expect(inputElement.attributes().placeholder).to.equals("test placeholder");
    expect(inputElement.attributes().disabled).to.be.undefined;
  });
});
