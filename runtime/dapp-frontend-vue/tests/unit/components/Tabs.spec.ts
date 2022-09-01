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
import Tabs from "@/components/Tabs/Tabs.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    $route: { params: {} },
  },
  propsData: {
    tabList: [
      {
        title: "All time",
        quickStats: [
          {
            title: "Minutes Exercised",
            amount: 3099,
            direction: "up",
          },
          {
            title: "$FIT earned",
            amount: 560,
            direction: "down",
          },
          {
            title: "Calories Burnt",
            amount: 1094,
            direction: "down",
          },
          {
            title: "Friends Referred",
            amount: 5,
            direction: "down",
          },
        ],
        medals: ["medal1.svg", "medal2.svg", "medal3.svg"],
        friends: [
          {
            avatar: "friend1.png",
            name: "Yoga Maestro",
          },
          {
            avatar: "friend2.png",
            name: "Terminator",
          },
        ],
      },
      {
        title: "Today",
        quickStats: [
          {
            title: "Minutes Exercised",
            amount: 520,
            direction: "down",
          },
          {
            title: "$FIT earned",
            amount: 350,
            direction: "down",
          },
          {
            title: "Calories Burnt",
            amount: 2035,
            direction: "up",
          },
          {
            title: "Friends Referred",
            amount: 5,
            direction: "down",
          },
        ],
        medals: ["medal1.svg"],
        friends: [
          {
            avatar: "friend1.png",
            name: "Yoga Maestro",
          },
          {
            avatar: "friend2.png",
            name: "Terminator",
          },
        ],
      },
    ],
    initialTab: 0,
  },
};

describe("Tabs -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(Tabs as any, componentOptions);
  });

  it("should have first tab selected", () => {
    expect(widget.vm.selectedTab).to.be.equal(widget.props("initialTab"));
  });

  it("should display tab buttons", () => {
    expect(widget.find(".tab").exists()).to.be.true;
  });

  it("should display text of selected tab", () => {
    const selected = widget.props("tabList")[widget.vm.selectedTab];
    expect(widget.find(".active").text()).to.be.equal(selected.title);
  });
});
