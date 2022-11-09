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
import LeaderboardRow from "@/components/LeaderboardRow/LeaderboardRow.vue";

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
  },
  propsData: {
    data: {
      type: "leaderboard",
      period: "weekly",
      address: "NATZJETZTZCGGRBUYVQRBEUFN5LEGDRSTNF2GYA",
      position: 2,
      assets: 1905,
      avatar: "avatar2.png",
      trendline: "down",
      activities: ["running", "cycling"],
    },
  },
};

describe("LeaderBoardRow -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(LeaderboardRow as any, componentOptions);
  });

  it("should exist", () => {
    expect(widget.find(".dapp-leaderboard-item").exists()).to.be.true;
  });

  it("should have default markup without slot", () => {
    expect(widget.vm.isCustom).to.be.false;
  });

  it("should display correct number of position in correct format", () => {
    expect(
      widget.find(".dapp-leaderboard-item__position span").text()
    ).to.be.equal(`#0${widget.props("data").position}`);
  });

  it("should not display border if color not provided", () => {
    expect(widget.find(".dapp-leaderboard-item__avatar").style).to.not.be.equal(
      "border-color: #ccc"
    );
  });

  it("should display an avatar", () => {
    expect(widget.find(".dapp-leaderboard-item__avatar img").exists()).to.be
      .true;
  });

  it("should display properly formatted address", () => {
    expect(
      widget.find(".dapp-leaderboard-item__user-info .name").text()
    ).to.be.equal("NATZJE...2GY");
  });

  it("should display trendline", () => {
    expect(widget.find(".dapp-triangle").exists()).to.be.true;
  });

  it("should display trendline with direction based on prop", () => {
    expect(widget.find(".dapp-triangle .down").exists()).to.be.true;
  });

  it("should display top activities", () => {
    expect(widget.find(".dapp-activities").exists()).to.be.true;
  });

  it("should display correct amount of activities", () => {
    expect(widget.findAll(".dapp-activities li")).to.have.length(
      widget.props("data").activities.length
    );
  });

  it("should display correct amount of $FIT", () => {
    expect(
      widget.find(".dapp-leaderboard-item__amount span").text()
    ).to.be.equal(`$${widget.props("data").assets} FIT`);
  });
});
