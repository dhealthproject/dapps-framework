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
import Footer from "@/components/Footer/Footer.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  propsData: {
    links: [
      { path: "#", text: "Home", icon: "" },
      { path: "#1", text: "Fitness", icon: "" },
      { path: "#2", text: "Mindfulness", icon: "" },
      { path: "#3", text: "Wellness", icon: "" },
    ],
  },
  stubs: ["router-link"],
};

describe("Footer -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = mount(Footer as any, componentOptions);
  });

  it("should display copyright", () => {
    expect(widget.find("span").classes()).to.include(
      "dapp-screen-footer__copy"
    );
  });

  it("should display footer links", () => {
    expect(widget.find("li").classes()).to.include("dapp-screen-footer__link");
  });
});
