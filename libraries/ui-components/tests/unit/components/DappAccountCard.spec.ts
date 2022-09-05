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
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import flushPromises from "flush-promises";

// internal dependencies
import DappAccountCard from "@/widgets/DappAccountCard/DappAccountCard.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  propsData: {
    address: "test-address",
  },
};

describe("DappAccountCard -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappAccountCard as any, componentOptions);
  });

  it("should have `DappAccountAvatar` & `DappTokenAmount` element", () => {
    expect(widget.find("DappAccountAvatar")).to.be.not.undefined;
    expect(widget.find("DappTokenAmount")).to.be.not.undefined;
  });

  it("should have correct prop default values:", () => {
    expect(widget.props().disableAvatar).to.be.true;
    expect(widget.props().disableAddress).to.be.true;
    expect(widget.props().inline).to.be.false;
    expect(widget.props().balance).to.equals(0);
    expect(widget.props().alias).to.equals("No alias");
    expect(widget.props().mosaicName).to.equals("DHP");
  });

  it("should display avatar & address & non-inline mosaic by default", () => {
    expect(widget.find("svg")).to.be.not.undefined;
    expect(widget.find(".dapp-account-card-address")).to.be.not.undefined;
    expect(widget.find(".dapp-account-card-mosaic")).to.be.not.undefined;
  });

  it("should copy address to clipboard when copy icon clicked", async () => {
    let clipboardContents = "";
    Object.assign(navigator, {
      clipboard: {
        writeText: (text: string) => {
          clipboardContents = text;
        },
        readText: () => clipboardContents,
      },
    });
    widget.setProps({ disableAddress: false });
    await flushPromises();
    const copyIcon = widget.find(".dapp-account-card-icon-copy");
    await copyIcon.trigger("click"); // triggers a click DOM event
    await widget.vm.$nextTick(); // waits until emits are handled
    expect(await navigator.clipboard.readText()).to.equals("test-address");
  });

  it("should display correct elements with `disableAvatar`, `disableAddress` & `inline`", async () => {
    const scenarios = [
      { disableAvatar: false, disableAddress: false, inline: false }, // 000
      { disableAvatar: false, disableAddress: false, inline: true }, // 001
      { disableAvatar: false, disableAddress: true, inline: false }, // 010
      { disableAvatar: false, disableAddress: true, inline: true }, // 011
      { disableAvatar: true, disableAddress: false, inline: false }, // 100
      { disableAvatar: true, disableAddress: false, inline: true }, // 101
      { disableAvatar: true, disableAddress: true, inline: false }, // 110
      { disableAvatar: true, disableAddress: true, inline: true }, // 111
    ];
    for (const scenario of scenarios) {
      await widget.setProps(scenario);
      expect(widget.find("svg").exists()).to.equals(!scenario.disableAvatar);
      expect(widget.find(".dapp-account-card-address").exists()).to.equals(
        !scenario.disableAddress
      );
      expect(widget.find(".dapp-account-card-mosaic").exists()).to.equals(
        !scenario.inline
      );
    }
  });
});
