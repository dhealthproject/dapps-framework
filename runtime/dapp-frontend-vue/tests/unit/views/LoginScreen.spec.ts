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
  },
};

describe("LoginScreen -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(LoginScreen as any, componentOptions);
  });

  it("should divide screen by 2", () => {
    expect(widget.find(".dapp-divided-screen").exists()).to.be.true;
  });

  it("should display logo", () => {
    expect(widget.find(".dapp-logo").exists()).to.be.true;
  });

  it("should display carousel", () => {
    expect(widget.find(".dapp-login-screen__carousel").exists()).to.be.true;
  });

  it("should display list of steps", () => {
    expect(widget.find(".steps").exists()).to.be.true;
  });
});
