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
import Vuex from "vuex";

// components page being tested
import Stats from "@/components/Stats/Stats.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
localVue.use(Vuex);
const actions = {
  initialize: jest.fn(),
};
const $store = new Vuex.Store({
  state: {},
  actions,
});

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
    $store,
  },
  propsData: {
    data: {
      address: "NATZJETZTZCGGRBUYVQRBEUFN5LEGDRSTNF2GYA",
      period: "20220101",
      periodFormat: "D",
      totalPracticedMinutes: 1600,
      totalEarned: 3.92,
      topActivities: ["running", "cycling"],
      totalReferral: 5,
      levelReferral: 2,
      friendsReferred: 20150,
    },
  },
};

describe("Stats -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(Stats as any, componentOptions);
  });

  it("should exist", () => {
    expect(widget.find(".dapp-stats").exists()).to.be.true;
  });

  it("should display first digit earned $FIT properly", () => {
    expect(widget.vm.fourDigitsAmount[0]).to.be.equal("3.92");
  });

  it("should display second digit earned $FIT properly", () => {
    expect(widget.vm.fourDigitsAmount[1]).to.be.equal("00");
  });

  it("should display practiced minutes", () => {
    expect(widget.find(".minutes__amount").text()).to.be.equal(
      widget.props("data").totalPracticedMinutes.toString()
    );
  });
});
