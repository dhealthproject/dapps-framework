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
import DappEditCircle from "@/graphics/DappEditCircle/DappEditCircle.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const content = { key: "value" };
const componentOptions = {
  localVue,
  propsData: {
    content,
  },
};

describe("DappEditCircle -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappEditCircle as any, componentOptions);
  });

  it("should have correct properties", () => {
    expect(widget.props().content).to.equals(content);
  });

  it("should display correct elements with correct attributes & classes", () => {
    const svgElement = widget.find("svg");
    const titleElement = svgElement.find("title");
    const defsElement = svgElement.find("defs");
    const linearGradientElement = defsElement.find("linearGradient");
    const stopElements = linearGradientElement.findAll("stop");
    const circleElements = svgElement.findAll("circle");
    const gElement = svgElement.find("g");
    const pathElement = gElement.find("path");
    expect(svgElement.exists()).to.be.true;
    expect(svgElement.attributes().version).to.equals("1.1");
    expect(svgElement.attributes().xmlns).to.equals(
      "http://www.w3.org/2000/svg"
    );
    expect(svgElement.attributes()["xmlns:xlink"]).to.equals(
      "http://www.w3.org/1999/xlink"
    );
    expect(svgElement.attributes().x).to.equals("0px");
    expect(svgElement.attributes().y).to.equals("0px");
    expect(svgElement.attributes().width).to.equals("38.5px");
    expect(svgElement.attributes().height).to.equals("38.167px");
    expect(svgElement.attributes().viewBox).to.equals("0 0 38.5 38.167");
    expect(svgElement.attributes()["xml:space"]).to.equals("preserve");
    expect(svgElement.classes()).to.include("dappEditCircle-circle-icon");
    expect(titleElement.exists()).to.be.true;
    expect(titleElement.text()).to.equals(JSON.stringify(content, null, 2));
    expect(defsElement.exists()).to.be.true;
    expect(linearGradientElement.exists()).to.be.true;
    expect(linearGradientElement.attributes().id).to.equals(
      "message-circle-gradient"
    );
    expect(linearGradientElement.attributes().x1).to.equals("0%");
    expect(linearGradientElement.attributes().y1).to.equals("0%");
    expect(linearGradientElement.attributes().x2).to.equals("100%");
    expect(linearGradientElement.attributes().y2).to.equals("100%");
    expect(stopElements.length).to.equals(2);
    expect(stopElements.at(0).attributes().offset).to.equals("0%");
    expect(stopElements.at(0).attributes()["stop-color"]).to.equals(
      "RGB(255, 197, 255)"
    );
    expect(stopElements.at(1).attributes().offset).to.equals("100%");
    expect(stopElements.at(1).attributes()["stop-color"]).to.equals(
      "RGB(255, 0, 255)"
    );
    expect(circleElements.length).to.be.equals(2);
    expect(circleElements.at(0).attributes()["fill-rule"]).to.equals("evenodd");
    expect(circleElements.at(0).attributes()["clip-rule"]).to.equals("evenodd");
    expect(circleElements.at(0).attributes().fill).to.equals(
      "url(#message-circle-gradient)"
    );
    expect(circleElements.at(0).attributes().cx).to.equals("19.115");
    expect(circleElements.at(0).attributes().cy).to.equals("19.094");
    expect(circleElements.at(0).attributes().r).to.equals("17.26");
    expect(circleElements.at(1).attributes()["fill-rule"]).to.equals("evenodd");
    expect(circleElements.at(1).attributes()["clip-rule"]).to.equals("evenodd");
    expect(circleElements.at(1).attributes().fill).to.equals("transparent");
    expect(circleElements.at(1).attributes().cx).to.equals("19.115");
    expect(circleElements.at(1).attributes().cy).to.equals("19.094");
    expect(circleElements.at(1).attributes().r).to.equals("17.26");
    expect(gElement.exists()).to.be.true;
    expect(pathElement.exists()).to.be.true;
    expect(pathElement.attributes().fill).to.equals("#FFFFFF");
  });
});
