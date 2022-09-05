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
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import flushPromises from "flush-promises";

// internal dependencies
import DappGraphicComponent from "@/graphics/DappGraphicComponent/DappGraphicComponent.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
};

describe("DappGraphicComponent -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappGraphicComponent as any, componentOptions);
  });

  it("should have correct default props", () => {
    expect(widget.props().x).to.equals(0);
    expect(widget.props().y).to.equals(0);
  });

  it("should have correct inputed props", async () => {
    const propsData = {
      x: 100,
      y: 200,
    };
    widget.setProps(propsData);
    await flushPromises();
    expect(widget.props().x).to.equals(100);
    expect(widget.props().y).to.equals(200);
  });
});
