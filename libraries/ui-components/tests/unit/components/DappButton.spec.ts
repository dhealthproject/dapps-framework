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
import DappButton from "@/controls/DappButton/DappButton.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
};

describe("DappButton -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappButton as any, componentOptions);
  });

  it("should display default text", () => {
    expect(widget.text()).to.include("Click this");
  });

  it("should always add base CSS class", () => {
    expect(widget.find("button").classes()).to.contain("base");
  });

  it("should add style-primary CSS class given default variant", () => {
    expect(widget.find("button").classes()).to.contain("base");
    expect(widget.find("button").classes()).to.contain("style-primary");
  });

  it("should add correct CSS class given different variants", () => {
    ["primary", "secondary", "tertiary"].forEach((variant: string) => {
      // prepare
      // overwrites "variant" property
      widget = shallowMount(DappButton as any, {
        ...componentOptions,
        propsData: { variant },
      });

      // assert
      expect(widget.find("button").classes()).to.contain("base");
      expect(widget.find("button").classes()).to.contain(`style-${variant}`);
    });
  });

  it("should emit click event given user click interaction", async () => {
    // prepare
    const button = widget.find("button");
    await button.trigger("click"); // triggers a click DOM event
    await widget.vm.$nextTick(); // waits until emits are handled

    // assert
    const actual = widget.emitted("click");
    expect(actual).to.not.be.undefined;

    if (actual !== undefined) {
      expect(actual.length).to.be.equal(1);
    }
  });
});
