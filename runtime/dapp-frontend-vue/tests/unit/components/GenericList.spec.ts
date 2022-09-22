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
import GenericList from "@/components/GenericList/GenericList.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    $route: { params: {} },
    getImageUrl: jest.fn(),
  },
  propsData: {
    items: ["medal1.svg", "medal2.svg", "medal3.svg", "medal4.svg"],
    title: "Test",
  },
};

describe("GenericList -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(GenericList as any, componentOptions);
  });

  it("should display component", () => {
    expect(widget.find(".list").exists()).to.be.true;
  });

  it("should display title", () => {
    expect(widget.find(".title").exists()).to.be.true;
  });

  it("should display items", async () => {
    await widget.vm.$nextTick();
    expect(
      widget.find(".dapp-list__custom__item").exists() ||
        widget.find(".dapp-friends-list__item").exists()
    ).to.be.true;
  });
});
