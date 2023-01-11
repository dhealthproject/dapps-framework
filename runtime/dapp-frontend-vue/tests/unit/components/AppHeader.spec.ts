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
import AppHeader from "@/components/AppHeader/AppHeader.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
localVue.directive("click-outside", jest.fn());
localVue.use(Vuex);
const $store = new Vuex.Store({
  state: {},
  getters: {
    "statistics/getUserStatistics": jest.fn().mockReturnValue({
      address: "NATZJETZTZCGGRBUYVQRBEUFN5LEGDRSTNF2GYA",
      type: "user",
      period: "2022-46",
      periodFormat: "W",
      position: 2,
      amount: 1.23,
      data: {
        totalEarned: 1.23,
        totalPracticedMinutes: 456,
        topActivities: "Ride",
      },
    }),
    "auth/getCurrentUserAddress": jest
      .fn()
      .mockReturnValue("NATZJETZTZCGGRBUYVQRBEUFN5LEGDRSTNF2GYA"),
  },
  actions: {
    initialize: jest.fn(),
    "statistics/fetchStatistics": jest.fn(),
  },
});

const getImageUrl = () => "../../../src/assets";

const formatAmount = (amount: number, divisibility: number) => {
  return amount / Math.pow(10, divisibility);
};

const componentOptions = {
  localVue,
  getImageUrl,
  formatAmount,
  stubs: ["router-link"],
  mocks: {
    getImageUrl,
    formatAmount,
    $route: { params: {} },
    $t: jest.fn(),
    $store,
  },
};

describe("AppHeader -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(AppHeader as any, componentOptions);
  });

  it("should exist", () => {
    expect(widget.find(".dapp-screen-header").exists()).to.be.true;
  });
});
