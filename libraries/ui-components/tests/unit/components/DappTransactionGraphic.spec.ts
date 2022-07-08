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
import { createLocalVue, mount, shallowMount, Wrapper } from "@vue/test-utils";
import DappTransactionGraphic from "@/widgets/DappTransactionGraphic/DappTransactionGraphic.vue";
import { TransactionType } from "@dhealth/sdk";
import DappAbstractTransactionGraphic from "@/transaction-graphic/DappAbstractTransactionGraphic/DappAbstractTransactionGraphic.vue";
import DappTransferGraphic from "@/transaction-graphic/DappTransferGraphic/DappTransferGraphic.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const transaction: any = {
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
const aggregateTransaction = {
  type: 16705,
  networkType: 104,
  version: 1,
  deadline: { adjustedValue: 39960784230 },
  maxFee: { lower: 30000, higher: 0 },
  signature:
    "6CEC17F0AD9DF1CBBCF956B04DFBA3A26BA6DE358C44B64353D321881766291A43417C98785CA28FCC8EE0E5D671BD415392B58B4E6806DA5C093A664C59B402",
  signer: {
    publicKey:
      "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE",
    address: {
      address: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
      networkType: 104,
    },
  },
  transactionInfo: {
    height: { lower: 1330527, higher: 0 },
    index: 0,
    id: "62C2C6AD357AE865FD55D3F1",
    hash: "C99475B7F1A32569673321C8CD9BE01B0949E835EA32E212F439A79F8087C732",
    merkleComponentHash:
      "C99475B7F1A32569673321C8CD9BE01B0949E835EA32E212F439A79F8087C732",
  },
  payloadSize: 280,
  innerTransactions: [
    {
      type: 16724,
      networkType: 104,
      version: 1,
      deadline: [],
      maxFee: [],
      signature:
        "6CEC17F0AD9DF1CBBCF956B04DFBA3A26BA6DE358C44B64353D321881766291A43417C98785CA28FCC8EE0E5D671BD415392B58B4E6806DA5C093A664C59B402",
      signer: {
        publicKey:
          "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE",
        address: {
          address: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
          networkType: 104,
        },
      },
      transactionInfo: {
        height: { lower: 1330527, higher: 0 },
        index: 0,
        id: "62C2C6AD357AE865FD55D3F2",
        hash: undefined,
        merkleComponentHash: undefined,
        aggregateHash:
          "C99475B7F1A32569673321C8CD9BE01B0949E835EA32E212F439A79F8087C732",
        aggregateId: "62C2C6AD357AE865FD55D3F1",
      },
      payloadSize: undefined,
      recipientAddress: {
        address: "NB3NMGUCABJXUSJUXD7C67JXJYSP3W6QPGNJ32Q",
        networkType: 104,
      },
      mosaics: [
        {
          id: { id: { lower: 2736956505, higher: 971031711 } },
          amount: { lower: 797888, higher: 0 },
        },
      ],
      message: { type: 0, payload: "20220704" },
    },
  ],
  cosignatures: [],
};
const componentOptions = {
  localVue,
  propsData: {
    transaction,
  },
};

describe("DappTransactionGraphic -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappTransactionGraphic as any, componentOptions);
  });

  it("should have correct default prop", () => {
    expect(widget.props().displayTransactionNumber).to.deep.equals(false);
  });

  it("should have correct props", () => {
    (componentOptions.propsData as any).displayTransactionNumber = true;
    widget = shallowMount(DappTransactionGraphic as any, componentOptions);
    expect(widget.props().displayTransactionNumber).to.deep.equals(true);
    expect(widget.props().transaction).to.deep.equals(transaction);
  });

  it("should display correct type of transaction graphic", () => {
    widget = mount(DappTransactionGraphic as any, componentOptions);
    expect(widget.findComponent(DappTransferGraphic).exists()).to.be.true;
  });

  it("should display correct elements when transaction is not aggregate", () => {
    const divEl = widget.find("div");
    const dappAbstractTransactionGraphicEl = divEl.find(
      "DappAbstractTransactionGraphic"
    );
    expect(dappAbstractTransactionGraphicEl).to.be.not.undefined;
  });

  it("should display correct elements when transaction is aggregate", () => {
    widget = shallowMount(DappTransactionGraphic as any, {
      localVue,
      propsData: { transaction: aggregateTransaction },
    });
    const bodyDivEl = widget.find(".dappTransactionGraphic-body");
    const aggregateContainerDivEl = bodyDivEl.find(
      ".dappTransactionGraphic-aggregate-container"
    );
    const signersSectionWrapperEl = aggregateContainerDivEl.find(
      ".dappTransactionGraphic-signers-section-wrapper"
    );
    const aggregateInnerEl = aggregateContainerDivEl.find(
      ".dappTransactionGraphic-aggregate-inner"
    );
    const aggregateInnerIndexEl = aggregateInnerEl.find(
      ".dappTransactionGraphic-aggregate-inner-index"
    );
    const dappAbstractTransactionGraphicEl = aggregateInnerEl.findComponent(
      DappAbstractTransactionGraphic
    );
    expect(bodyDivEl.exists()).to.be.true;
    expect(aggregateContainerDivEl.exists()).to.be.true;
    expect(signersSectionWrapperEl.exists()).to.be.false;
    expect(aggregateInnerEl.exists()).to.be.true;
    expect(aggregateInnerIndexEl.exists()).to.be.false;
    expect(dappAbstractTransactionGraphicEl.exists()).to.be.true;
  });
});
