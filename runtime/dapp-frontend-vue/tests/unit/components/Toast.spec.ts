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
import Toast from "@/components/Toast/Toast.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const componentOptions = {
  localVue,
  stubs: ["router-link"],
  mocks: {
    $route: { params: {} },
    getImageUrl: jest.fn().mockReturnValue("fake-src"),
  },
  propsData: {
    config: () => ({
      title: "Great job!",
      description: "We’ve integrated your account",
      state: "success",
      icon: "icons/like-icon.svg",
      dismissTimeout: 7000,
    }),
  },
  slots: {},
};

describe("Toast -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(Toast as any, componentOptions);
  });

  it("should display component", () => {
    expect(widget.find(".dapp-toast").exists()).to.be.true;
  });

  it("should display title", () => {
    expect(widget.find("h2").exists()).to.be.true;
  });

  it("should display description", () => {
    expect(widget.find("p").exists()).to.be.true;
  });

  //   it("should hide on close icon click", async () => {
  //     const button = widget.find(".close");
  //     button.trigger("click");
  //     await widget.vm.$nextTick();
  //     expect(widget.emitted()["toast-close"][0]);
  //   });
});
