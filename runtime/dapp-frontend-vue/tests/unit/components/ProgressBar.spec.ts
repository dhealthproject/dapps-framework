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
import ProgressBar from "@/components/ProgressBar/ProgressBar.vue";

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
    steps: 5,
    completedSteps: 2,
  },
  slots: {},
};

describe("ProgressBar -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(ProgressBar as any, componentOptions);
  });

  it("should display component", () => {
    expect(widget.find(".dapp-progress").exists()).to.be.true;
  });

  it("should display steps equal to prop value", () => {
    expect(widget.findAll(".item").length).to.be.equal(widget.props("steps"));
  });

  it("should display completed steps equal to prop value", () => {
    expect(widget.findAll(".completed").length).to.be.equal(
      widget.props("completedSteps")
    );
  });
});
