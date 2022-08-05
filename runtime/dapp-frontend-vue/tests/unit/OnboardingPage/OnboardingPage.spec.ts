/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Unit Tests
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { expect } from "chai";
import { mount, createLocalVue } from "@vue/test-utils";
import OnboardingPage from "@/views/OnboardingPage/OnboardingPage.vue";
import { Auth } from "@/modules/Auth/Auth";
import { Profile } from "@/modules/Profile/Profile";
import { Transaction } from "@dhealth/sdk";
import sinon from "sinon";

// const stubRequestHandler = {
//   call: () => this,
// };
const getImageUrl = () => "../../../src/assets/ELEVATE.svg";
// const stubService = {
//   baseUrl: "http://localhost:7903",
//   handler: stubRequestHandler,
//   getUrl: () => "this",
//   getAuthChallenge: () => this,
//   login: () => this,
//   getMe: () => this,
// };

// jest.mock("../../../src/modules/Auth/Auth");

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    getImageUrl,
  },
  // propsData: {
  //   service: new Auth(),
  // },
};
// jest.mock("@dhealth/sdk", () => ({ Deadline: jest.fn() }));

describe("OnboardingPage -->", () => {
  let widget: any;
  let mockedResponse: any;
  beforeEach(async () => {
    widget = await mount(OnboardingPage as any, componentOptions);
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

  it("should display qr code", async () => {
    if (widget.vm.loading) {
      expect(widget.find(".base img").exists()).to.be.false;
    } else {
      expect(widget.find(".base img").exists()).to.be.true;
    }
  });

  it("should display footer", () => {
    expect(widget.find(".dapp-screen-footer").exists()).to.be.true;
  });

  it("should return transaction", async () => {
    await widget.vm.$nextTick();
    expect(
      widget.vm.getTransactionRequest(
        widget.vm.transactionRequestConfig
      ) instanceof Transaction
    ).to.be.true;
  });

  it("should create Login Contract", () => {
    expect(widget.vm.createLoginContract()).to.not.be.undefined;
  });

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
