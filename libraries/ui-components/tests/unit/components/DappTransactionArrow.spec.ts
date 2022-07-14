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
import DappTransactionArrow from "@/graphics/DappTransactionArrow/DappTransactionArrow.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  propsData: {
    mosaics: [{ id: "test-mosaic", amount: 123.12 }],
  },
};

describe("DappTransactionArrow -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappTransactionArrow as any, componentOptions);
  });

  it("should display correct elements", () => {
    const svgEl = widget.find("svg");
    const gEl = svgEl.find("g");
    const lineEl = gEl.find("line");
    const polygonEl = gEl.find("polygon");
    const foreignObjectEl = svgEl.find("foreignObject");
    expect(svgEl.exists()).to.be.true;
    expect(gEl.exists()).to.be.true;
    expect(lineEl.exists()).to.be.true;
    expect(polygonEl.exists()).to.be.true;
    expect(foreignObjectEl.exists()).to.be.true;
  });

  it("should have correct svg attributes", () => {
    const attributes = widget.find("svg").attributes();
    expect(attributes.id).to.equals("arrow");
    expect(attributes.version).to.equals("1.1");
    expect(attributes.xmlns).to.equals("http://www.w3.org/2000/svg");
    expect(attributes["xmlns:xlink"]).to.equals("http://www.w3.org/1999/xlink");
    expect(attributes.x).to.equals("0px");
    expect(attributes.y).to.equals("0px");
    expect(attributes.width).to.equals("302px");
    expect(attributes.height).to.equals("27px");
    expect(attributes.viewBox).to.equals("0 0 302 27");
    expect(attributes["xml:space"]).to.equals("preserve");
  });

  it("should have correct css classes", () => {
    const svgEl = widget.find("svg");
    const gEl = svgEl.find("g");
    const lineEl = gEl.find("line");
    const polygonEl = gEl.find("polygon");
    const foreignObjectEl = svgEl.find("foreignObject");
    expect(lineEl.classes()).to.include("dappTransactionArrow-arrow-body");
    expect(polygonEl.classes()).to.include("dappTransactionArrow-arrow-end");
    expect(foreignObjectEl.classes()).to.include(
      "dappTransactionArrow-circle-icons-container"
    );
  });
});
