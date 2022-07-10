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
import DappUnknownTransaction from "@/transaction-graphics/DappUnknownTransaction/DappUnknownTransaction.vue";
import DappTreeView from "@/graphics/DappTreeView/DappTreeView.vue";

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
    transaction,
  },
};

describe("DappUnknownTransaction -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappUnknownTransaction as any, componentOptions);
  });

  it("should have correct prop", () => {
    expect(widget.props().transaction).to.equals(transaction);
  });

  it("should render correct elements with correct css classes", () => {
    const divEl = widget.find("div");
    const ulEl = divEl.find("ul");
    const dappTreeViewEl = widget.find(DappTreeView);
    expect(divEl.exists()).to.be.true;
    expect(ulEl.exists()).to.be.true;
    expect(dappTreeViewEl.exists()).to.be.true;

    expect(divEl.classes()).to.include(
      "dappUnknownTransaction-unknown-tx-view"
    );
  });
});
