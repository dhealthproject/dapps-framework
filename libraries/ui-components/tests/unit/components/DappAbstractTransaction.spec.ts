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
import { TransactionType } from "@dhealth/sdk";

// internal dependencies
import DappAbstractTransaction from "@/graphics/transactions/DappAbstractTransaction/DappAbstractTransaction.vue";
import DappTransferTransaction from "@/graphics/transactions/DappTransferTransaction/DappTransferTransaction.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const transaction = {
  type: TransactionType.TRANSFER,
  networkType: 104,
  version: 1,
  deadline: { adjustedValue: 37303161787 },
  maxFee: { lower: 0, higher: 0 },
  signature:
    "77F4F2E1CA46D02CC99FF31E627AED133A3835A47C68A8D8C1DB3A31DA849E03DC214F7916393C9B1277C4212AE9D2CAFA36BE2C9051858B3D379A20AA502306",
  signer: {
    publicKey:
      "482ED1E391BEB5882835053D961BCCF54B36513629E039C3F4A9AFDC4D5A5239",
    address: {
      address: "NASVGKMONTQRTSY3LG3V36XBZ5VLHWHDYRPSYXI",
      networkType: 104,
    },
  },
  transactionInfo: {
    height: { lower: 1242015, higher: 0 },
    index: "undefined",
    id: "undefined",
    hash: "F495F1D93FCC8E7B7297158A3DE66916B5B86D542AE9A76EF3434F7D33BC8B96",
    merkleComponentHash:
      "F495F1D93FCC8E7B7297158A3DE66916B5B86D542AE9A76EF3434F7D33BC8B96",
  },
  payloadSize: "undefined",
  recipientAddress: {
    address: "NASVGKMONTQRTSY3LG3V36XBZ5VLHWHDYRPSYXI",
    networkType: 104,
  },
  mosaics: [
    {
      id: { id: { lower: 2736956505, higher: 971031711 } },
      amount: { lower: 5000000, higher: 0 },
    },
  ],
  message: { type: 0, payload: "test create transfer tx - 1654274358763" },
};
const componentOptions = {
  localVue,
  propsData: {
    transaction,
  },
};

describe("DappAbstractTransaction -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappAbstractTransaction as any, componentOptions);
  });

  it("should have correct prop", () => {
    expect(widget.props().transaction).to.equals(transaction);
  });

  it("should display correct element", () => {
    const divEl = widget.find("div");
    expect(divEl.exists()).to.be.true;
    const transferEl = divEl.findComponent(DappTransferTransaction);
    expect(transferEl.exists()).to.be.true;
  });
});
