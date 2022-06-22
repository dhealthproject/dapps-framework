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
import { shallowMount, Wrapper, createLocalVue } from "@vue/test-utils";
import OnboardingPage from "@/views/OnboardingPage/OnboardingPage.vue";
import { Transaction } from "@dhealth/sdk";
// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  stubs: ["router-link"],
};

describe("OnboardingPage -->", () => {
  let widget: any;
  beforeEach(() => {
    widget = shallowMount(OnboardingPage as any, componentOptions);
  });

  it("should display footer", () => {
    expect(widget.find("div").classes()).to.include("dapp-screen-footer");
  });

  it("should display header", () => {
    expect(widget.find("div").classes()).to.include("dapp-screen-header");
  });

  it("should return transaction", () => {
    expect(widget.vm.getTransactionRequest() instanceof Transaction).to.be.true;
  });

  it("should create Login Contract", () => {
    expect(widget.vm.createLoginContract()).to.not.be.undefined;
  });
});
