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
import Medals from "@/views/Medals/Medals.vue";

// mocks the AuthService completely
jest.mock("@/services/AuthService");

// creates local vue instance for tests
const localVue = createLocalVue();

const getImageUrl = () => "../../../src/assets/ELEVATE.svg";

const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    getImageUrl,
    $route: { params: {} },
    $router: {
      push: jest.fn(),
    },
    $t: jest.fn(),
    $store: {
      dispatch: jest.fn(),
      commit: jest.fn(),
      getters: {
        "auth/getCurrentUserAddress": "fakeAddress",
        "assets/getAssets": [
          {
            transactionHash: "fakeHash",
            userAddress: "fakeAddress",
            creationBlock: 704585,
            assetId: "fakeId",
            amount: 1156898,
          },
          {
            transactionHash: "fakeHash2",
            userAddress: "fakeAddress",
            creationBlock: 769585,
            assetId: "fakeId",
            amount: 1281998,
          },
        ],
      },
    },
  },
};

describe("Medals ->", () => {
  let widget: any;

  beforeEach(() => {
    (console as any).log = jest.fn();
    widget = mount(Medals as any, componentOptions);
  });

  it("should display component", () => {
    expect(widget.find(".dapp-medals").exists()).to.be.true;
  });

  it("should display at least one list", () => {
    expect(widget.find(".dapp-rewards-list").exists()).to.be.true;
  });
});
