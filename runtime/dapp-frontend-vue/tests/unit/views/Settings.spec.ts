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
import Settings from "@/views/Settings/Settings.vue";

// mocks the AuthService completely
jest.mock("@/services/AuthService");

// creates local vue instance for tests
const localVue = createLocalVue();

const getImageUrl = () => "../../../src/assets/ELEVATE.svg";

const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    methods: {
      removeIntegration: jest.fn(),
    },
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
        "oauth/getIntegrations": ["strava"],
      },
    },
  },
};

describe("Settings -->", () => {
  let widget: any;

  beforeEach(() => {
    (console as any).log = jest.fn();
    widget = mount(Settings as any, componentOptions);
  });

  it("should display settings list", () => {
    expect(widget.find(".dapp-screen-settings").exists()).to.be.true;
  });

  it("should display settings item", () => {
    expect(widget.find(".setting").exists()).to.be.true;
  });

  it("should not display settings item if integrations empty", () => {
    // prepare
    const wrapper = mount(Settings as any, {
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
            "oauth/getIntegrations": [],
          },
        },
      },
    });

    // act
    expect(wrapper.find(".setting").exists()).to.be.false;
  });
});
