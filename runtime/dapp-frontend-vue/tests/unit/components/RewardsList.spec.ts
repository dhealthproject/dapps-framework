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
import RewardsList from "@/components/RewardsList/RewardsList.vue";
import { MedalItem } from "@/components/RewardsList/RewardsList";

// mocks the AuthService completely
jest.mock("@/services/AuthService");

// creates local vue instance for tests
const localVue = createLocalVue();

const getImageUrl = () => "../../../src/assets/ELEVATE.svg";

const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    propsData: {
      title: "testTitle",
      description: "testDescription",
      medals: [
        {
          image: "testImagePath",
          condition: "Test condition",
          relatedActivities: "Run, Cycle, Swim",
          received: true,
          assetId: "testID",
        },
        {
          image: "testImagePath2",
          condition: "Test condition2",
          relatedActivities: "Walk",
          received: false,
          assetId: "testID2",
        },
      ],
    },
    getImageUrl,
    $route: { params: {} },
    $router: {
      push: jest.fn(),
    },
    $t: jest.fn(),
  },
};

describe("Medals ->", () => {
  let widget: any;

  beforeEach(() => {
    (console as any).log = jest.fn();
    widget = mount(RewardsList as any, componentOptions);
  });

  it("should display component", () => {
    expect(widget.find(".dapp-rewards-list").exists()).to.be.true;
  });

  it("should display title", () => {
    expect(widget.find(".dapp-rewards-list__title").text()).to.be.equal(
      widget.props("title")
    );
  });

  it("should display description", () => {
    expect(widget.find(".dapp-rewards-list__description").text()).to.be.equal(
      widget.props("description")
    );
  });

  it("should display list of medals", () => {
    expect(widget.findAll(".medal").length).to.be.equal(
      widget.props("medals").length
    );
  });

  it("should display received medals equal to prop", () => {
    const receivedMedals = widget
      .props("medals")
      .filter((medal: MedalItem) => medal.received);

    expect(widget.findAll(".received").length).to.be.equal(
      receivedMedals.length
    );
  });
});
