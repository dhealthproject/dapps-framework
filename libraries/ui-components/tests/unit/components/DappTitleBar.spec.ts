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
import DappTitleBar from "@/widgets/DappTitleBar/DappTitleBar.vue";
import DappTitle from "@/texts/DappTitle/DappTitle.vue";

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
    expect(widget.props().title).to.equals("dHealth Network");
    widget = shallowMount(DappTitleBar as any, {
      ...componentOptions,
      propsData: { title: "test-title" },
    });
    expect(widget.props().title).to.equals("test-title");
  });

  it("should render DappTitle component with correct value", async () => {
    const dappTitle = widget.findComponent(DappTitle);
    expect(dappTitle.exists()).is.true;
    expect(dappTitle.props().text).to.equals("dHealth Network");
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
});
