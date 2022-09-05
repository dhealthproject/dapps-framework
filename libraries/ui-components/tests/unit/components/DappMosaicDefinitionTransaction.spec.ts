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
import {
  MosaicFlags,
  MosaicId,
  NetworkType,
  PublicAccount,
} from "@dhealth/sdk";

// internal dependencies
import DappMosaicDefinitionTransaction from "@/graphics/transactions/DappMosaicDefinitionTransaction/DappMosaicDefinitionTransaction.vue";
import DappAccountAvatar from "@/graphics/DappAccountAvatar/DappAccountAvatar.vue";
import DappMosaicIcon from "@/graphics/DappMosaicIcon/DappMosaicIcon.vue";
import DappTransactionArrow from "@/graphics/DappTransactionArrow/DappTransactionArrow.vue";
import DappAddCircle from "@/graphics/DappAddCircle/DappAddCircle.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const transaction = {
  type: 16717,
  network: NetworkType.MAIN_NET,
  version: 1,
  maxFee: "15000",
  deadline: "37737763657",
  signature: "test-signature",
  signer: PublicAccount.createFromPublicKey(
    "6AD87A56356C1F774B0AB2F0B9D33CA92027981360DD96AF37028D7D1362B96D",
    104
  ),
  nonce: 3585839868,
  mosaicId: new MosaicId("3EEB6CB369BC02A3"),
  flags: MosaicFlags.create(true, true, false),
  divisibility: 0,
  duration: "10000",
};
const componentOptions = {
  localVue,
  propsData: {
    transaction,
  },
};

describe("DappMosaicDefinitionTransaction -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(
      DappMosaicDefinitionTransaction as any,
      componentOptions
    );
  });

  it("should have correct properties", () => {
    expect(widget.props().transaction).to.equals(transaction);
  });

  it("should display correct elements with correct attributes & classes", () => {
    const mainDivElement = widget.find("div");
    const svgElement = mainDivElement.find("svg");
    const dappAccountAvatarElement =
      svgElement.findComponent(DappAccountAvatar);
    const dappMosaicIconElement = svgElement.findComponent(DappMosaicIcon);
    const dappTransactionArrowElement =
      svgElement.findComponent(DappTransactionArrow);
    const dappAddCircleElement = svgElement.findComponent(DappAddCircle);
    const textElement = svgElement.find("text");
    const titleElement = textElement.find("title");
    expect(mainDivElement.exists()).to.be.true;
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
    expect(svgElement.attributes().width).to.equals("700px");
    expect(svgElement.attributes().height).to.equals("200px");
    expect(svgElement.attributes().viewBox).to.equals("140 200 700 200");
    expect(svgElement.attributes()["xml:space"]).to.equals("preserve");
    expect(dappAccountAvatarElement.exists()).to.be.true;
    expect(dappAccountAvatarElement.attributes().x).to.equals("112");
    expect(dappAccountAvatarElement.attributes().y).to.equals("240");
    expect(dappAccountAvatarElement.attributes().width).to.equals("261.333");
    expect(dappAccountAvatarElement.attributes().height).to.equals("131.313");
    expect(dappAccountAvatarElement.attributes().address).to.equals(
      "NDXB7NNXCHXEMQRUSCDGKDYZB2X5EDUM5GDDOMY"
    );
    expect(dappMosaicIconElement.exists()).to.be.true;
    expect(dappMosaicIconElement.attributes().x).to.equals("614");
    expect(dappMosaicIconElement.attributes().y).to.equals("240");
    expect(dappMosaicIconElement.attributes().width).to.equals("261.333");
    expect(dappMosaicIconElement.attributes().height).to.equals("131.313");
    expect(dappMosaicIconElement.attributes().mosaic).to.deep.equals(
      "[object Object]"
    );
    expect(dappTransactionArrowElement.exists()).to.be.true;
    expect(dappTransactionArrowElement.attributes().x).to.equals("341");
    expect(dappTransactionArrowElement.attributes().y).to.equals("305");
    expect(dappAddCircleElement.exists()).to.be.true;
    expect(dappAddCircleElement.attributes().x).to.equals("466");
    expect(dappAddCircleElement.attributes().y).to.equals("300");
    expect(dappAddCircleElement.attributes().content).to.equals(
      "[object Object]"
    );
    expect(dappAddCircleElement.attributes().title).to.equals(
      "Mosaic Definition"
    );
    expect(textElement.exists()).to.be.true;
    expect(textElement.attributes().x).to.equals("485");
    expect(textElement.attributes().y).to.equals("361.9268");
    expect(textElement.attributes()["text-anchor"]).to.equals("middle");
    expect(textElement.classes()).to.include(
      "dappMosaicDefinitionTransaction-message"
    );
    expect(titleElement.exists()).to.be.true;
    expect(titleElement.text()).to.equals("Mosaic Definition");
  });
});
