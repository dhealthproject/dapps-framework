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
import TopActivities from "@/components/TopActivities/TopActivities.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const getImageUrl = () => "../../../src/assets";

const componentOptions = {
  localVue,
  getImageUrl,
  stubs: ["router-link"],
  mocks: {
    getImageUrl,
    formatAddress: jest.fn(() => "NATZJE...2GY"),
    $route: { params: {} },
    $t: jest.fn(),
  },
  propsData: {
    items: ["running, swimming"],
  },
};

describe("TopActivities -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(TopActivities as any, componentOptions);
  });

  it("should exist", () => {
    expect(widget.find(".dapp-activities").exists()).to.be.true;
  });

  it("should display correct amount of items", () => {
    expect(widget.findAll(".dapp-activities li")).to.have.length(
      widget.props("items").length
    );
  });
});
