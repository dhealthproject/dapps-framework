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
import DirectionTriangle from "@/components/DirectionTriangle/DirectionTriangle.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    $route: { params: {} },
  },
  propsData: {
    direction: "up",
  },
};

describe("Card -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(DirectionTriangle as any, componentOptions);
  });

  it("should display triangle", () => {
    expect(widget.find(".dapp-triangle").exists()).to.be.greaterThanOrEqual;
  });

  it("should display triangle in up direction", () => {
    expect(widget.find(".up").exists()).to.be.greaterThanOrEqual;
  });
});
