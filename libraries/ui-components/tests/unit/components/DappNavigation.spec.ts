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
import DappNavigation from "@/headers/DappNavigation/DappNavigation.vue";
import DappTitleBar from "@/headers/DappTitleBar/DappTitleBar.vue";
import DappTitle from "@/texts/DappTitle/DappTitle.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  propsData: {
    noOfMenuItems: 1,
    title: "test-title",
  },
};

describe("DappNavigation -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappNavigation as any, componentOptions);
  });

  it("should have correct prop values and default prop values", () => {
    expect(widget.props().noOfMenuItems).to.equals(1);
    expect(widget.props().title).to.equals("test-title");
    expect(widget.props().variant).to.equals("primary");
  });

  it("should always add base CSS class", () => {
    expect(widget.find("div").classes()).to.contain("dappNavigation-base");
  });

  it("should add style-primary CSS class given default variant", () => {
    expect(widget.find("div").classes()).to.contain("dappNavigation-base");
    expect(widget.find("div").classes()).to.contain(
      "dappNavigation-style-primary"
    );
  });

  it("should add correct CSS class given different variants", () => {
    ["primary", "secondary", "tertiary"].forEach((variant: string) => {
      // prepare
      // overwrites "variant" property
      widget = shallowMount(DappNavigation as any, {
        ...componentOptions,
        propsData: { variant },
      });

      // assert
      expect(widget.find("div").classes()).to.contain("dappNavigation-base");
      expect(widget.find("div").classes()).to.contain(
        `dappNavigation-style-${variant}`
      );
    });
  });

  it("should render correct menu slots", () => {
    // prepare
    const slots = {
      start: "<div>start-slot-content</div>",
      end: "<div>end-slot-content</div>",
    };
    widget = shallowMount(DappNavigation as any, {
      ...componentOptions,
      slots,
    });

    // assert
    for (const key in slots) {
      expect(widget.html()).to.includes(`${key}-slot-content`);
    }
  });

  it("should render correct menu item slots", () => {
    // prepare
    [2, 3, 5].forEach((noOfMenuItems: number) => {
      const slots: Record<string, string> = {};
      for (let i = 1; i <= noOfMenuItems; i++) {
        slots[`menuItem${i}`] = `<div>menuItem${i}-slot-content</div>`;
      }
      widget = shallowMount(DappNavigation as any, {
        ...componentOptions,
        propsData: {
          noOfMenuItems,
        },
        slots,
      });

      // assert
      for (let i = 1; i <= noOfMenuItems; i++) {
        expect(widget.html()).to.includes(`menuItem${i}-slot-content`);
      }
    });
  });

  it("should render correct elements", () => {
    // prepare
    const slots = {
      start: "<div>start-slot-content</div>",
      menuItem1: "<div>menuItem1-slot-content</div>",
      end: "<div>end-slot-content</div>",
    };
    widget = shallowMount(DappNavigation as any, {
      ...componentOptions,
      propsData: {
        noOfMenuItems: 2,
      },
      slots,
    });
    // assert
    const rootElement = widget.find("div");
    const dappTitleBar = rootElement.findComponent(DappTitleBar);
    expect(rootElement.exists()).to.be.true;
    expect(dappTitleBar.exists()).to.be.true;
    const leftSlotElement = dappTitleBar.find(".dappNavigation-start");
    expect(leftSlotElement.exists()).to.be.true;
    const menuItemsSlotElement = dappTitleBar.find(".dappNavigation-menuItems");
    expect(menuItemsSlotElement.exists()).to.be.true;
    const menuItemsSlotInnerElements = menuItemsSlotElement.findAll(
      ".dappNavigation-menuItem"
    );
    expect(menuItemsSlotInnerElements.length).to.equals(2);
    const titleSlotElement = dappTitleBar.find(".dappNavigation-title");
    expect(titleSlotElement.exists()).to.be.true;
    const dappTitleElement = titleSlotElement.findComponent(DappTitle);
    expect(dappTitleElement.exists()).to.be.true;
    const nonMobileEndSlotElement = dappTitleBar.find(".dappNavigation-end-sm");
    expect(nonMobileEndSlotElement.exists()).to.be.true;
    const mobileEndSlotElement = dappTitleBar.find(".dappNavigation-end");
    expect(mobileEndSlotElement.exists()).to.be.true;
    expect(mobileEndSlotElement.attributes().width).to.equals("24");
    expect(mobileEndSlotElement.attributes().height).to.equals("24");
    expect(mobileEndSlotElement.attributes().viewBox).to.equals("0 0 24 24");
    expect(mobileEndSlotElement.attributes().fill).to.equals("none");
    expect(mobileEndSlotElement.attributes().xmlns).to.equals(
      "http://www.w3.org/2000/svg"
    );
    expect(mobileEndSlotElement.attributes().class).to.equals(
      "dappNavigation-end"
    );
    const pathElement = mobileEndSlotElement.find("path");
    expect(pathElement.attributes().d).to.equals(
      "M16 18V20H5V18H16ZM21 11V13H3V11H21ZM19 4V6H8V4H19Z"
    );
    expect(pathElement.attributes().fill).to.equals("#1D1843");
  });
});
