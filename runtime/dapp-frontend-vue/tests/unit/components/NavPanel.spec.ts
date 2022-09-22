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
import NavPanel from "@/components/NavPanel/NavPanel.vue";

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
  slots: {
    "nav-left": "Left",
    "nav-center": "Center",
    "nav-right": "Right",
  },
};

describe("NavPanel -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(NavPanel as any, componentOptions);
  });

  it("should display component", () => {
    expect(widget.find(".dapp-nav-panel").exists()).to.be.true;
  });

  it("should display left slot", () => {
    expect(widget.find(".dapp-nav-panel__left").text()).to.be.equal("Left");
  });

  it("should display center slot", () => {
    expect(widget.find(".dapp-nav-panel__center").text()).to.be.equal("Center");
  });

  it("should display right slot", () => {
    expect(widget.find(".dapp-nav-panel__right").text()).to.be.equal("Right");
  });
});
