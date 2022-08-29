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
import DappNavigationItem from "@/graphics/DappNavigationItem/DappNavigationItem.vue";
import DappIcon from "@/graphics/DappIcon/DappIcon.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const icon = "test/icon/path.csv";
const label = "menu item 1";
const componentOptions = {
  localVue,
  propsData: {
    icon,
    label,
  },
};

describe("DappNavigationItem -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappNavigationItem as any, componentOptions);
  });

  it("should have correct prop values and default prop values", () => {
    expect(widget.props().icon).to.equals("test/icon/path.csv");
    expect(widget.props().label).to.equals("menu item 1");
    expect(widget.props().variant).to.equals("primary");
  });

  it("should always add base CSS class", () => {
    expect(widget.find("div").classes()).to.contain("dappNavigationItem-base");
  });

  it("should add style-primary CSS class given default variant", () => {
    expect(widget.find("div").classes()).to.contain("dappNavigationItem-base");
    expect(widget.find("div").classes()).to.contain(
      "dappNavigationItem-style-primary"
    );
  });

  it("should add correct CSS class given different variants", () => {
    ["primary", "secondary", "tertiary"].forEach((variant: string) => {
      // prepare
      // overwrites "variant" property
      widget = shallowMount(DappNavigationItem as any, {
        ...componentOptions,
        propsData: { variant },
      });

      // assert
      expect(widget.find("div").classes()).to.contain(
        "dappNavigationItem-base"
      );
      expect(widget.find("div").classes()).to.contain(
        `dappNavigationItem-style-${variant}`
      );
    });
  });

  it("should render correct elements", () => {
    const root = widget.find("div");
    expect(root.exists()).to.be.true;

    const mainDivElement = root.find("div");
    expect(mainDivElement.exists()).to.be.true;

    const dappIconElement = mainDivElement.findComponent(DappIcon);
    expect(dappIconElement.exists()).to.be.true;
    expect(dappIconElement.props().src).to.equals(icon);
    expect(dappIconElement.props().size).to.equals("medium-small");

    const spanElement = mainDivElement.find("span");
    expect(spanElement.exists()).to.be.true;
    expect(spanElement.text()).to.equals(label);
  });
});
