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
import MobileNavigationButton from "@/components/MobileNavigationButton/MobileNavigationButton.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    $route: { params: {} },
    getImageUrl: jest.fn(),
  },
  propsData: {},
};

describe("MobileNavigationButton -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(MobileNavigationButton as any, componentOptions);
  });

  it("should display component", () => {
    expect(widget.find(".dapp-mobile-navigation-button").exists()).to.be.true;
  });

  it("should emit @menu-toggle on click", async () => {
    // expect(widget.find(".dapp-mobile-navigation-button").exists()).to.be.true;
    const button = widget.find(".dapp-mobile-navigation-button");
    button.trigger("click");
    await widget.vm.$nextTick();
    expect(widget.emitted()["menu-toggle"][0]);
  });
});
