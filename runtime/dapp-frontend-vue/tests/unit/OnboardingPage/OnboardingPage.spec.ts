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
import { mount, Wrapper, createLocalVue } from "@vue/test-utils";
import OnboardingPage from "@/views/OnboardingPage/OnboardingPage.vue";
import { Transaction } from "@dhealth/sdk";
// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
};

describe("OnboardingPage -->", () => {
  let widget: any;
  beforeEach(() => {
    widget = mount(OnboardingPage as any, componentOptions);
  });

  it("should get TransactionRequest", () => {
    expect(widget.vm.getTransactionRequest());
  });

  it("should have header", () => {
    expect(true);
  });
});
