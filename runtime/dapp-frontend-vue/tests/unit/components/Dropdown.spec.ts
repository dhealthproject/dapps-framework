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
import Dropdown from "@/components/Dropdown/Dropdown.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    $route: { params: {} },
    getImageUrl: jest.fn(),
  },
};

describe("Dropdown -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(Dropdown as any, componentOptions);
  });

  it("should display dropdown wrapper", () => {
    expect(widget.find(".dapp-dropdown").exists()).to.be.true;
  });

  it("should not display dropdown initially", () => {
    expect(widget.find(".dapp-dropdown__actions").exists()).to.be.false;
  });

  it("should display dropdown on click .dapp-dropdown__default", async () => {
    // expect(widget.find(".dapp-dropdown").exists()).to.be.true;
    const clickItem = widget.find(".dapp-dropdown__default");
    clickItem.trigger("click");
    await widget.vm.$nextTick();
    expect(widget.vm.isOpen).to.be.true;
  });
});
