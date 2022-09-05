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

// internal dependencies
import DappMosaicCircle from "@/graphics/DappMosaicCircle/DappMosaicCircle.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions = {
  localVue,
  propsData: {
    mosaics: [{ id: "test-mosaic", amount: 123.12 }],
  },
};

describe("DappMosaicCircle -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappMosaicCircle as any, componentOptions);
  });

  it("should have correct props", () => {
    expect(widget.props().mosaics).to.deep.equals([
      { id: "test-mosaic", amount: 123.12 },
    ]);
  });

  it("should display correct elements", () => {
    const svgElement = widget.find("svg");
    const titleElement = svgElement.find("title");
    const defsElement = svgElement.find("defs");
    const linearGradientElement = defsElement.find("linearGradient");
    const stopElements = linearGradientElement.findAll("stop");
    const circleElements = svgElement.findAll("circle");
    const gElement = svgElement.find("g");
    const pathElements = gElement.findAll("path");
    expect(svgElement.exists()).to.be.true;
    expect(titleElement.exists()).to.be.true;
    expect(defsElement.exists()).to.be.true;
    expect(linearGradientElement.exists()).to.be.true;
    expect(stopElements.length).to.equals(2);
    expect(circleElements.length).to.be.equals(2);
    expect(gElement.exists()).to.be.true;
    expect(pathElements.length).to.equals(3);
  });

  it("should have correct svg attributes", () => {
    const attributes = widget.find("svg").attributes();
    expect(attributes.version).to.equals("1.1");
    expect(attributes.xmlns).to.equals("http://www.w3.org/2000/svg");
    expect(attributes["xmlns:xlink"]).to.equals("http://www.w3.org/1999/xlink");
    expect(attributes.x).to.equals("0px");
    expect(attributes.y).to.equals("0px");
    expect(attributes.width).to.equals("38.5px");
    expect(attributes.height).to.equals("38.167px");
    expect(attributes.viewBox).to.equals("0 0 38.5 38.167");
    expect(attributes["xml:space"]).to.equals("preserve");
    expect(attributes.class).to.equals("dappMosaicCircle-circle-icon");
  });
});
