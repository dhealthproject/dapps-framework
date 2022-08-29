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
import DappTitleBar from "@/headers/DappTitleBar/DappTitleBar.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
};

describe("DappTitleBar -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappTitleBar as any, componentOptions);
  });

  it("should have correct props", () => {
    widget = shallowMount(DappTitleBar as any, {
      ...componentOptions,
    });
    expect(widget.props().variant).to.equals("primary");
  });

  it("should always add dappTitleBar-base CSS class", () => {
    expect(widget.find("div").classes()).to.contain("dappTitleBar-base");
  });

  it("should add dappTitleBar-style-primary CSS class given default variant", () => {
    expect(widget.find("div").classes()).to.contain("dappTitleBar-base");
    expect(widget.find("div").classes()).to.contain(
      "dappTitleBar-style-primary"
    );
  });

  it("should add correct CSS class given different variants", () => {
    ["primary", "secondary", "tertiary"].forEach((variant: string) => {
      // prepare
      // overwrites "variant" property
      widget = shallowMount(DappTitleBar as any, {
        ...componentOptions,
        propsData: { variant },
      });

      // assert
      expect(widget.find("div").classes()).to.contain("dappTitleBar-base");
      expect(widget.find("div").classes()).to.contain(
        `dappTitleBar-style-${variant}`
      );
    });
  });

  it("should render slots", () => {
    // prepare
    const slots: Record<string, string> = {
      left: `<div>left-slot-content</div>`,
      center: `<div>center-slot-content</div>`,
      right: `<div>right-slot-content</div>`,
    };
    // adding "slots" property
    widget = shallowMount(DappTitleBar as any, {
      ...componentOptions,
      slots,
    });
    // assert
    for (const key in slots) {
      expect(widget.html()).to.includes(`${key}-slot-content`);
    }
  });
});
