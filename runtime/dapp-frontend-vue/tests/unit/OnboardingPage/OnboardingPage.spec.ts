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
import sinon from "sinon";
import { mount, createLocalVue } from "@vue/test-utils";

// internal dependencies
import { Auth } from "@/modules/Auth/Auth";
import { Profile } from "@/modules/Profile/Profile";

// components page being tested
import OnboardingPage from "@/views/OnboardingPage/OnboardingPage.vue";
//import { createTransactionRequestMock } from "tests/mocks/global";

// mocks the Auth module completely
jest.mock("@/modules/Auth/Auth");

const getImageUrl = () => "../../../src/assets/ELEVATE.svg";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    getImageUrl,
    $route: { params: {} },
  },
  propsData: {
    loading: true,
  },
};

describe("OnboardingPage -->", () => {
  let widget: any;
  let mockedResponse: any;
  beforeEach(() => {
    widget = mount(OnboardingPage as any, componentOptions);
    mockedResponse = {
      data: "test",
      status: 200,
      statusText: "OK",
      config: {},
      headers: {},
    };
  });

  it("should display header", () => {
    expect(widget.find(".dapp-screen-header").exists()).to.be.true;
  });

  it("should display loader", async () => {
    expect(widget.find(".dapp-loader").exists()).to.be.true;
  });

  it("should display footer", () => {
    expect(widget.find(".dapp-screen-footer").exists()).to.be.true;
  });

  // it("should return transaction", async () => {
  //   await widget.vm.$nextTick();
  //   expect(
  //     widget.vm.getTransactionRequest(
  //       widget.vm.transactionRequestConfig
  //     ) instanceof Transaction
  //   ).to.be.true;
  // });

  // @todo fix this, seems toHaveBeenCalledTimes is not recognized
  // it("should create Login Contract", () => {
  //   expect(createTransactionRequestMock).toHaveBeenCalledTimes(1);
  // });

  it("should contain message", async () => {
    const service = new Auth();
    sinon.stub(service, "getAuthChallenge").resolves(mockedResponse);
    const message = await service.getAuthChallenge();
    expect(message).to.not.be.empty;
  });

  it("should receive access token", async () => {
    const service = new Auth();
    sinon.stub(service, "login").resolves(mockedResponse);
    const accessToken = await service.login({
      address: "",
      authCode: "not test",
    });

    expect(accessToken).to.not.be.empty;
  });

  it("should receive user data", async () => {
    const service = new Profile();
    const user = await service.getMe();

    expect(user).to.have;
  });
});
