/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Unit Tests
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { createLocalVue, shallowMount, Wrapper } from "@vue/test-utils";
import {
  Address,
  Deadline,
  Mosaic,
  MosaicId,
  PlainMessage,
  PublicAccount,
  UInt64,
} from "@dhealth/sdk";
import { expect } from "chai";
import DappTreeView from "@/graphics/DappTreeView/DappTreeView.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const transaction: any = {
  type: 16718,
  networkType: 104,
  version: 1,
  deadline: Deadline.createFromAdjustedValue(37303161787),
  maxFee: UInt64.fromUint(0),
  signature:
    "77F4F2E1CA46D02CC99FF31E627AED133A3835A47C68A8D8C1DB3A31DA849E03DC214F7916393C9B1277C4212AE9D2CAFA36BE2C9051858B3D379A20AA502306",
  signer: PublicAccount.createFromPublicKey(
    "482ED1E391BEB5882835053D961BCCF54B36513629E039C3F4A9AFDC4D5A5239",
    104
  ),
  transactionInfo: {
    height: UInt64.fromNumericString("1242015"),
    index: 0,
    id: "629A394C357AE865FD52237F",
    hash: "F495F1D93FCC8E7B7297158A3DE66916B5B86D542AE9A76EF3434F7D33BC8B96",
    merkleComponentHash:
      "F495F1D93FCC8E7B7297158A3DE66916B5B86D542AE9A76EF3434F7D33BC8B96",
  },
  payloadSize: 216,
  recipientAddress: Address.createFromRawAddress(
    "NASVGKMONTQRTSY3LG3V36XBZ5VLHWHDYRPSYXI"
  ),
  mosaics: [
    new Mosaic(
      new MosaicId([2736956505, 971031711]),
      UInt64.fromNumericString("5000000")
    ),
  ],
  message: PlainMessage.create("test create transfer tx - 1654274358763"),
};

const componentOptions = {
  localVue,
  propsData: {
    name: "test-transaction",
    item: transaction,
  },
};

describe("DappTreeView -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappTreeView as any, componentOptions);
  });

  it("should have correct props", () => {
    expect(widget.props().name).to.equals("test-transaction");
    expect(widget.props().item).to.equals(transaction);
  });

  it("should render recursively correct number of times", () => {
    expect(widget.findAllComponents(DappTreeView).length).to.equals(13);
  });

  it("should have correct css classes for expandable items", () => {
    const liElement = widget.find("li");
    const mainDivElement = liElement.find("div");
    const spanElements = mainDivElement.findAll("span");
    expect(liElement.classes()).to.include("dappTreeView-item");
    expect(mainDivElement.classes()).to.include("dappTreeView-non-overflown");
    expect(spanElements.at(0).classes()).to.include("dappTreeView-field-name");
    expect(spanElements.at(0).classes()).to.include("dappTreeView-bold");
    expect(spanElements.at(1).classes()).to.include("dappTreeView-field-name");
    expect(spanElements.at(1).classes()).to.include("dappTreeView-bold");
  });

  it("should have correct css classes for non-expandable items", () => {
    widget = shallowMount(DappTreeView as any, {
      ...componentOptions,
      propsData: { name: "testString", item: "test-string" },
    });
    const liElement = widget.find("li");
    const mainDivElement = liElement.find("div");
    const spanElements = mainDivElement.findAll("span");
    expect(liElement.classes()).to.include("dappTreeView-item");
    expect(mainDivElement.classes()).to.include("dappTreeView-non-overflown");
    expect(spanElements.at(0).classes()).to.include("dappTreeView-field-name");
    expect(spanElements.at(0).classes()).to.not.include("dappTreeView-bold");
    expect(spanElements.at(1).classes()).to.be.empty;
  });

  it("should render correct text for each fundamental type", () => {
    const propList = [
      { name: "type", item: transaction.type }, // TransactionType
      { name: "networkType", item: transaction.networkType }, // NetworkType
      { name: "deadline", item: transaction.deadline }, // Deadline
      { name: "maxFee", item: transaction.maxFee }, // UInt64
      { name: "signer", item: transaction.signer }, // PublicAccount
      { name: "height", item: transaction.transactionInfo.height }, // UInt64
      { name: "hash", item: transaction.transactionInfo.hash }, // string
      { name: "payloadSize", item: transaction.payloadSize }, // number
      { name: "recipientAddress", item: transaction.recipientAddress }, // Address
      { name: "testUndefined", item: undefined }, // undefined
      { name: "type", item: transaction.message.type }, // MessageType
    ];
    const expectedTexts = [
      "type:  NAMESPACE_REGISTRATION",
      "networkType:  MAIN_NET",
      "deadline:  2022-06-04T01:39:18.787",
      "maxFee:  0",
      "signer:  NASVGKMONTQRTSY3LG3V36XBZ5VLHWHDYRPSYXI",
      "height:  1242015",
      "hash:  F495F1D93FCC8E7B7297158A3DE66916B5B86D542AE9A76EF3434F7D33BC8B96",
      "payloadSize:  216",
      "recipientAddress:  NASVGKMONTQRTSY3LG3V36XBZ5VLHWHDYRPSYXI",
      "testUndefined:  undefined",
      "type:  PlainMessage",
    ];
    propList.forEach((props, index) => {
      widget = shallowMount(DappTreeView as any, {
        ...componentOptions,
        propsData: props,
      });
      expect(widget.text()).to.equals(expectedTexts[index]);
    });
  });
});
