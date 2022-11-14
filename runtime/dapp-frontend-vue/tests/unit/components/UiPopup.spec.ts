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
import { mount, createLocalVue, createWrapper } from "@vue/test-utils";

// components page being tested
import UiPopup from "@/components/UiPopup/UiPopup.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const getImageUrl = () => "../../../src/assets";

const componentOptions = {
  localVue,
  getImageUrl,
  stubs: ["router-link"],
  mocks: {
    getImageUrl,
    formatAddress: jest.fn(() => "NATZJE...2GY"),
    $route: { params: {} },
    $t: jest.fn(),
  },
  propsData: {
    config: {
      keepOnBgClick: true,
      type: "notification",
      title: "This is test popup",
      width: 500,
      description: "Test popup which don't have an illustration",
      illustration: "user-avatar.png",
    },
  },
};

describe("UiButton -->", () => {
  let widget: any;

  beforeEach(() => {
    widget = mount(UiPopup as any, componentOptions);
  });

  it("should exist", () => {
    expect(widget.find(".dapp-ui-popup").exists()).to.be.true;
  });

  it("should display description", () => {
    expect(widget.find(".img-wrapper p").text()).to.be.equal(
      widget.props("config").description
    );
  });

  it("should close on X button click", async () => {
    const closeButton = widget.find(
      ".dapp-ui-popup__modal__notification__close"
    );
    const rootWrapper = createWrapper(widget.vm.$root);

    await closeButton.trigger("click");
    expect(rootWrapper.emitted("modal-close")).to.exist;
  });
});
