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
import { BackendService } from "@/views/OnboardingPage/OnboardingPage";
import { Transaction } from "@dhealth/sdk";
import Vue from "vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  stubs: ["router-link"],
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
    await Vue.nextTick();
    expect(widget.find(".base img").exists()).to.be.true;
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
    const service = new BackendService();
    const message = await service.getAuthChallenge();

    expect(message).to.not.be.empty;
  });
});
