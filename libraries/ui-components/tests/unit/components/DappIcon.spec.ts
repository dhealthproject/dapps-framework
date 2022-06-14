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
import DappIcon from "@/graphics/DappIcon/DappIcon.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
};

describe("DappIcon -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappIcon as any, componentOptions);
  });

  it("should have correct properties", () => {
    [
      {name: "src", value: "test/src/image.png"},
      {name: "alt", value: "test-alt"},
    ].forEach((prop: {name: string, value: string}) => {
      const propsData: any = {};
      propsData[prop.name] = prop.value;
      widget = shallowMount(DappIcon as any, {
        ...componentOptions,
        propsData,
      });
  
      // assert
      expect(widget.find("img").attributes()[prop.name]).to.eq(prop.value);  
    });
  });

  it("should add style-medium CSS class given default size", () => {
    expect(widget.find("img").classes()).to.contain("style-medium");
  });

  it("should add correct CSS class given different sizes", () => {
    ["small", "medium", "large"].forEach((size: string) => {
      // prepare
      // overwrites "variant" property
      widget = shallowMount(DappIcon as any, {
        ...componentOptions,
        propsData: { size },
      });

      // assert
      expect(widget.find("img").classes()).to.contain(`style-${size}`);
    });
  });
});
