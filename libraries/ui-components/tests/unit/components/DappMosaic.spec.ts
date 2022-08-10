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
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import DappMosaic from "@/fields/DappMosaic/DappMosaic.vue";
import DappInput from "@/fields/DappInput/DappInput.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const mosaic = { id: "test-mosaic-id", amount: { compact: () => 123.123 } };
const componentOptions = {
  localVue,
  propsData: {
    value: mosaic,
    iconSrc: "test-icon-src",
    mosaicName: "TDHP",
  },
};

describe("DappMosaic -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappMosaic as any, componentOptions);
  });

  it("should have correct props", () => {
    expect(widget.props().value).to.equal(mosaic);
    expect(widget.props().iconSrc).to.equal("test-icon-src");
    expect(widget.props().mosaicName).to.equal("TDHP");
  });

  it("should render correctly", () => {
    const dappInputElement = widget.findComponent(DappInput);
    expect(dappInputElement.exists()).to.be.true;
    expect(dappInputElement.props()["leftIconSrc"]).to.equal("test-icon-src");
    expect(dappInputElement.props()["inputValue"]).to.equal("123.12 TDHP");
    expect(dappInputElement.props()["disabled"]).to.equal(true);
  });
});
