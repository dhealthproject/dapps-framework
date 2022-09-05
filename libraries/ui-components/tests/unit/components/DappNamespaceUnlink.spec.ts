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
import DappNamespaceUnlinkCircle from "@/graphics/DappNamespaceUnlinkCircle/DappNamespaceUnlinkCircle.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const namespaces = [{
  namespaceId: "9D8930CDBB417337",
  namespaceName: "dhp",
}];
const componentOptions = {
  localVue,
  propsData: {
    namespaces,
  },
};

describe("DappNamespaceUnlinkCircle -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappNamespaceUnlinkCircle as any, componentOptions);
  });

  it("should have correct default props & correct inputted props", () => {
    expect(widget.props().namespaces).to.deep.equals(namespaces);
  });

  it("should render correct elements with correct attributes", () => {
    const mainSVGEl = widget.find("svg");
    const titleEl = mainSVGEl.find("title");
    const defsEl = mainSVGEl.find("defs");
    const linearGradientEl = defsEl.find("linearGradient");
    const stopEls = linearGradientEl.findAll("stop");
    const circleEls = mainSVGEl.findAll("circle");
    const gEl = mainSVGEl.find("g");
    const pathEl = mainSVGEl.find("path");
    // main svg element
    expect(mainSVGEl.exists()).to.be.true;
    expect(mainSVGEl.attributes().version).equals("1.1");
    expect(mainSVGEl.attributes().xmlns).equals("http://www.w3.org/2000/svg");
    expect(mainSVGEl.attributes()["xmlns:xlink"]).equals(
      "http://www.w3.org/1999/xlink"
    );
    expect(mainSVGEl.attributes().x).equals("0px");
    expect(mainSVGEl.attributes().y).equals("0px");
    expect(mainSVGEl.attributes().width).equals("38.5px");
    expect(mainSVGEl.attributes().height).equals("38.167px");
    expect(mainSVGEl.attributes().viewBox).equals("0 0 38.5 38.167");
    expect(mainSVGEl.attributes()["xml:space"]).equals("preserve");
    expect(mainSVGEl.classes()).to.include("circle-icon");
    // title element
    expect(titleEl.exists()).to.be.true;
    expect(titleEl.text()).to.equals(
      '[\n  {\n    "namespaceId": "9D8930CDBB417337",\n    "namespaceName": "dhp"\n  }\n]'
    );
    // defs element
    expect(defsEl.exists()).to.be.true;
    // linearGradient element
    expect(linearGradientEl.exists()).to.be.true;
    expect(linearGradientEl.attributes().id).to.equals(
      "namespace-circle-gradient"
    );
    expect(linearGradientEl.attributes().x1).to.equals("0%");
    expect(linearGradientEl.attributes().y1).to.equals("0%");
    expect(linearGradientEl.attributes().x2).to.equals("100%");
    expect(linearGradientEl.attributes().y2).to.equals("100%");
    // stop element
    expect(stopEls.length).to.equals(2);
    expect(stopEls.at(0).attributes().offset).to.equals("0%");
    expect(stopEls.at(0).attributes()["stop-color"]).to.equals(
      "RGB(177, 241, 255)"
    );
    expect(stopEls.at(1).attributes().offset).to.equals("100%");
    expect(stopEls.at(1).attributes()["stop-color"]).to.equals(
      "RGB(5, 201, 255)"
    );
    // circle element
    expect(circleEls.length).to.equals(2);
    expect(circleEls.at(0).attributes()["fill-rule"]).to.equals("evenodd");
    expect(circleEls.at(0).attributes()["clip-rule"]).to.equals("evenodd");
    expect(circleEls.at(0).attributes()["fill"]).to.equals(
      "url(#namespace-circle-gradient)"
    );
    expect(circleEls.at(0).attributes()["cx"]).to.equals("19.115");
    expect(circleEls.at(0).attributes()["cy"]).to.equals("19.094");
    expect(circleEls.at(0).attributes()["r"]).to.equals("17.26");
    expect(circleEls.at(1).attributes()["fill-rule"]).to.equals("evenodd");
    expect(circleEls.at(1).attributes()["clip-rule"]).to.equals("evenodd");
    expect(circleEls.at(1).attributes().fill).to.equals("transparent");
    expect(circleEls.at(1).attributes().cx).to.equals("19.115");
    expect(circleEls.at(1).attributes().cy).to.equals("19.094");
    expect(circleEls.at(1).attributes().r).to.equals("17.26");
    // g element
    expect(gEl.exists()).to.be.true;
    // path element
    expect(pathEl.exists()).to.be.true;
    expect(pathEl.attributes().fill).to.equals("#FFFFFF");
  });
});
