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
  MosaicId,
  MosaicSupplyChangeAction,
  NetworkType,
  PublicAccount,
  TransactionType,
  UInt64,
} from "@dhealth/sdk";

// internal dependencies
import DappMosaicSupplyChangeTransaction from "@/graphics/transactions/DappMosaicSupplyChangeTransaction/DappMosaicSupplyChangeTransaction.vue";
import DappAccountAvatar from "@/graphics/DappAccountAvatar/DappAccountAvatar.vue";
import DappMosaicIcon from "@/graphics/DappMosaicIcon/DappMosaicIcon.vue";
import DappTransactionArrow from "@/graphics/DappTransactionArrow/DappTransactionArrow.vue";
import DappEditCircle from "@/graphics/DappEditCircle/DappEditCircle.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const transaction = {
  type: TransactionType.MOSAIC_SUPPLY_CHANGE,
  network: NetworkType.MAIN_NET,
  version: 1,
  maxFee: "2000000",
  deadline: "37737763657",
  signature: "test-signature",
  signer: PublicAccount.createFromPublicKey(
    "0E37A5626FBE6FC2B5180D06E11F1214D6C10CB0D1AFA85EA8D4C54D9CD03A4A",
    104
  ),
  mosaicId: new MosaicId("7EF96C58B9A32C7F"),
  delta: UInt64.fromUint(100000),
  action: MosaicSupplyChangeAction.Increase,
};
const componentOptions = {
  localVue,
  propsData: {
    transaction,
  },
};

describe("DappMosaicSupplyChangeTransaction -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(
      DappMosaicSupplyChangeTransaction as any,
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
    const dappAddCircleElement = svgElement.findComponent(DappEditCircle);
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
      "NAYDANHJJZBDPCUOG46JZOI653NRV4CEZJM4ZXY"
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
    expect(textElement.exists()).to.be.true;
    expect(textElement.attributes().x).to.equals("485");
    expect(textElement.attributes().y).to.equals("361.9268");
    expect(textElement.attributes()["text-anchor"]).to.equals("middle");
    expect(textElement.classes()).to.include(
      "dappMosaicSupplyChangeTransaction-message"
    );
    expect(titleElement.exists()).to.be.true;
    expect(titleElement.text()).to.equals("Mosaic Supply Change");
  });
});
