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
import Card from "@/components/Card/Card.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    $route: { params: {} },
  },
};

describe("Card -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(Card as any, componentOptions);
  });

  it("should display card", () => {
    expect(widget.find(".dapp-card").exists()).to.be.greaterThanOrEqual;
  });
});
