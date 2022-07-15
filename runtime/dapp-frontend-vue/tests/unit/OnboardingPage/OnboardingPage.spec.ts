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
import { Transaction } from "@dhealth/sdk";
import sinon from "sinon";

const stubRequestHandler = {
  call: () => this,
};
const stubService = {
  baseUrl: "http://localhost:7903",
  handler: stubRequestHandler,
  getUrl: () => "this",
  getAuthChallenge: () => this,
  login: () => this,
  getMe: () => this,
};

sinon.stub(stubService, "getAuthChallenge").resolves({ data: "test" });
sinon.stub(stubService, "getUrl").returns("test-url");
sinon.stub(stubService, "login").resolves("test-login");
sinon.stub(stubService, "getMe").resolves("test-getMe");
sinon.stub(Auth, "getInstance").returns(stubService as any);

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  stubs: ["router-link"],
  propsData: {
    service: stubService,
  },
};
// jest.mock("@dhealth/sdk", () => ({ Deadline: jest.fn() }));

describe("OnboardingPage -->", async () => {
  let widget: any;
  beforeEach(async () => {
    widget = await mount(OnboardingPage as any, componentOptions);
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

  // it("should contain message", async () => {
  //   const service = Auth.getInstance();
  //   sinon.stub(service, "getAuthChallenge").resolves("test");
  //   const message = await service.getAuthChallenge();
  //   expect(message).to.not.be.empty;
  // });

  // it("should receive access token", async () => {
  //   const service = Auth.getInstance();
  //   sinon.stub(service, "login").resolves("test");
  //   const accessToken = await service.login({
  //     address: "",
  //     authCode: "not test",
  //   });

  //   expect(accessToken).to.not.be.empty;
  // });

  // it("should receive user data", async () => {
  //   const service = Auth.getInstance();
  //   const user = await service.getMe();

  //   expect(user).to.have;
  // });
});
