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

// internal dependencies

// components page being tested
import Loader from "@/components/Loader/Loader.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const getImageUrl = () => "../../../src/assets";

const componentOptions = {
  localVue,
  getImageUrl,
  stubs: ["router-link"],
  mocks: {
    getImageUrl,
    $route: { params: {} },
  },
  propsData: {},
};

describe("Loader -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(Loader as any, componentOptions);
  });

  it("should exist", () => {
    expect(widget.find(".dapp-loader").exists()).to.be.true;
  });

  it("should display svg", () => {
    expect(widget.find(".dapp-loader svg").exists()).to.be.true;
  });
});
