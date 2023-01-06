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
import LoginScreen from "@/views/LoginScreen/LoginScreen.vue";

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
        "auth/isAuthenticated": true,
        "auth/getChallenge": "rwrwer",
        "auth/getAuthRegistry": "fake-registry",
      },
    },
  },
};

describe("LoginScreen -->", () => {
  let widget: any;

  beforeEach(() => {
    (console as any).log = jest.fn();
    widget = mount(LoginScreen as any, componentOptions);
  });

  it("should divide screen by 2", () => {
    expect(widget.find(".dapp-divided-screen").exists()).to.be.true;
  });

  it("should display list of steps", () => {
    expect(widget.find(".qr-wrapper__list").exists()).to.be.true;
  });

  it("should display nav panel", () => {
    expect(widget.find(".dapp-nav-panel").exists()).to.be.true;
  });

  it("should display back button inside of nav panel", () => {
    expect(widget.find(".dapp-nav-panel__left").exists()).to.be.true;
  });

  it("should display display button on mobile", () => {
    expect(widget.find(".login-mobile").exists()).to.be.true;
  });

  it("should generate correct href for mobile login button", () => {
    expect(widget.find(".login-mobile").attributes()["href"]).to.be.equal(
      `dhealth://sign?payload=${widget.vm.qrConfig?.toJSON()}`
    );
  });

  it("should display qr code", () => {
    // await widget.vm.$nextTick();
    // expect(widget.find(".qr-code").exists()).to.be.true;
    expect(widget.vm.createLoginQRCode()).to.be.not.null;
  });
});
