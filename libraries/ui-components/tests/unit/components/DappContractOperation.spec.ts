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
import {
  createLocalVue,
  shallowMount,
  Wrapper,
  WrapperArray,
} from "@vue/test-utils";
import {
  Address,
  Message,
  Mosaic,
  MosaicId,
  PlainMessage,
  PublicAccount,
  TransactionType,
  UInt64,
} from "@dhealth/sdk";

// internal dependencies
import { Asset } from "@/types/Asset";
import DappContractOperation from "@/widgets/DappContractOperation/DappContractOperation.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

const transaction = {
  type: TransactionType.TRANSFER,
  networkType: 104,
  version: 1,
  deadline: { adjustedValue: 37303161787 },
  maxFee: { lower: 0, higher: 0 },
  signature: "test-signature",
  signer: PublicAccount.createFromPublicKey(
    "482ED1E391BEB5882835053D961BCCF54B36513629E039C3F4A9AFDC4D5A5239",
    104
  ),
  transactionInfo: {
    height: UInt64.fromUint(1242015),
    index: "undefined",
    id: "undefined",
    hash: "F495F1D93FCC8E7B7297158A3DE66916B5B86D542AE9A76EF3434F7D33BC8B96",
    merkleComponentHash:
      "F495F1D93FCC8E7B7297158A3DE66916B5B86D542AE9A76EF3434F7D33BC8B96",
  },
  payloadSize: "undefined",
  recipientAddress: Address.createFromRawAddress(
    "NASVGKMONTQRTSY3LG3V36XBZ5VLHWHDYRPSYXI"
  ),
  mosaics: [
    new Mosaic(new MosaicId([2736956505, 971031711]), UInt64.fromUint(5e6)),
  ],
  message: PlainMessage.create(JSON.stringify("non-contract transaction")),
};

const asset: Asset = {
  mosaicId: "39E0C49FA322A459",
  label: "DHP",
  priceCurrency: "USD",
  price: 0.01,
  inputDecimals: 6,
  outputDecimals: 2,
};

const componentOptions = {
  localVue,
  propsData: {
    transaction,
    senderName: "test-sender-name",
    recipientName: "test-recipient-name",
    asset,
  },
};

describe("DappContractOperation -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappContractOperation as any, componentOptions);
  });

  it("should has correct values & default values for props", () => {
    expect(widget.props().transaction).to.equals(transaction);
    expect(widget.props().senderName).to.equals("test-sender-name");
    expect(widget.props().recipientName).to.equals("test-recipient-name");
    expect(widget.props().displayAddresses).to.be.true;
    expect(widget.props().asset).to.equals(asset);
  });

  it("should display correct elements with correct attributes & css classes", () => {
    const messages = [
      PlainMessage.create("non-contract transaction"),
      PlainMessage.create(
        JSON.stringify({ contract: "elevate:auth", version: 1, authCode: 1 })
      ),
      PlainMessage.create(
        JSON.stringify({
          contract: "elevate:referral",
          version: 1,
          authCode: 1,
        })
      ),
      PlainMessage.create(
        JSON.stringify({ contract: "elevate:earn", version: 1, authCode: 1 })
      ),
      PlainMessage.create(
        JSON.stringify({ contract: "elevate:nft", version: 1, authCode: 1 })
      ),
    ];
    messages.forEach(async (message: Message, index: number) => {
      transaction.message = message;
      widget = shallowMount(DappContractOperation as any, componentOptions);
      await widget.vm.$nextTick();
      const mainDivElement = widget.find(".DappContractOperation-mainDiv");
      expect(mainDivElement.exists()).to.be.true;
      const iconDivElement = mainDivElement.find(
        ".DappContractOperation-iconDiv"
      );
      testIconDiv(iconDivElement);
      const addressDivElements = mainDivElement.findAll(
        ".DappContractOperation-addressDiv"
      );
      testAddressDivs(addressDivElements);
      const arrowDivElement = mainDivElement.find(
        ".DappContractOperation-arrow"
      );
      testArrowDivarrowDivElement(arrowDivElement);
      const amountDivElement = mainDivElement.find(
        ".DappContractOperation-amountDiv"
      );
      testContractAmountDivElements(amountDivElement, index);
    });
  });
});

function testIconDiv(
  iconDivElement: Wrapper<
    DappContractOperation<Record<string, any>, Record<string, any>>
  >
) {
  expect(iconDivElement.exists()).to.be.true;
  const svgElement = iconDivElement.find("svg");
  expect(svgElement.exists()).to.be.true;
  expect(svgElement.attributes().width).to.equals("19");
  expect(svgElement.attributes().height).to.equals("22");
  expect(svgElement.attributes().viewBox).to.equals("0 0 19 22");
  expect(svgElement.attributes().fill).to.equals("none");
  expect(svgElement.attributes().xmlns).to.equals("http://www.w3.org/2000/svg");
  const pathElement = svgElement.find("path");
  expect(pathElement.exists()).to.be.true;
  expect(pathElement.attributes().fill).to.equals("#2970FF");
}

function testAddressDivs(
  addressDivElements: WrapperArray<
    DappContractOperation<Record<string, any>, Record<string, any>>
  >
) {
  expect(addressDivElements.exists()).to.be.true;
  expect(addressDivElements.length).to.equals(2);

  const senderAddressDivElement = addressDivElements.at(0);
  expect(senderAddressDivElement.exists()).to.be.true;
  const senderAddressNameSpanElement = senderAddressDivElement.find(
    ".DappContractOperation-addressNameSpan"
  );
  expect(senderAddressNameSpanElement.exists()).to.be.true;
  expect(senderAddressNameSpanElement.text()).to.equals("test-sender-name");
  const senderAddressSpanElement = senderAddressDivElement.find(
    ".DappContractOperation-addressAddressSpan"
  );
  expect(senderAddressSpanElement.exists()).to.be.true;
  expect(senderAddressSpanElement.text()).to.equals(
    "NASVGK-MONTQR-TSY3LG-3V36XB-Z5VLHW-HDYRPS-YXI"
  );

  const recipientAddressDivElement = addressDivElements.at(1);
  expect(recipientAddressDivElement.exists()).to.be.true;
  const recipientAddressNameSpanElement = recipientAddressDivElement.find(
    ".DappContractOperation-addressNameSpan"
  );
  expect(recipientAddressNameSpanElement.exists()).to.be.true;
  expect(recipientAddressNameSpanElement.text()).to.equals(
    "test-recipient-name"
  );
  const recipientAddressSpanElement = recipientAddressDivElement.find(
    ".DappContractOperation-addressAddressSpan"
  );
  expect(recipientAddressSpanElement.exists()).to.be.true;
  expect(recipientAddressSpanElement.text()).to.equals(
    "NASVGK-MONTQR-TSY3LG-3V36XB-Z5VLHW-HDYRPS-YXI"
  );
}

function testArrowDivarrowDivElement(
  arrowDivElement: Wrapper<
    DappContractOperation<Record<string, any>, Record<string, any>>
  >
) {
  expect(arrowDivElement.exists()).to.be.true;

  const arrowSvgElement = arrowDivElement.find("svg");
  expect(arrowSvgElement.exists()).to.be.true;
  expect(arrowSvgElement.attributes().width).to.equals("25");
  expect(arrowSvgElement.attributes().height).to.equals("25");
  expect(arrowSvgElement.attributes().viewBox).to.equals("0 0 25 25");
  expect(arrowSvgElement.attributes().fill).to.equals("#198155");
  expect(arrowSvgElement.attributes().xmlns).to.equals(
    "http://www.w3.org/2000/svg"
  );

  const arrowPathElement = arrowDivElement.find("path");
  expect(arrowPathElement.exists()).to.be.true;
  expect(arrowPathElement.attributes().fill).to.equals("#198155");
}

function testContractAmountDivElements(
  amountDivElement: Wrapper<
    DappContractOperation<Record<string, any>, Record<string, any>>
  >,
  index: number
) {
  expect(amountDivElement.exists()).to.be.true;
  if (index > 0) {
    const contractDivElement = amountDivElement.find(
      ".DappContractOperation-contract"
    );
    expect(contractDivElement.exists()).to.be.true;
    const contractSpanElement = contractDivElement.find(
      ".DappContractOperation-amountContract"
    );
    expect(contractSpanElement.exists()).to.be.true;
    const contractType = JSON.parse(transaction.message.payload).contract;
    expect(contractSpanElement.text()).to.equals(contractType);
  } else {
    const amountInnerDivElement = amountDivElement.find(
      ".DappContractOperation-amount"
    );
    expect(amountInnerDivElement.exists()).to.be.true;
    const amountTokenSpanElement = amountInnerDivElement.find(
      ".DappContractOperation-amountToken"
    );
    expect(amountTokenSpanElement.exists()).to.be.true;
    const expectedAmount = (
      transaction.mosaics[0].amount.compact() / 1e6
    ).toFixed(2);
    expect(amountTokenSpanElement.text()).to.equals(expectedAmount);
    const amountTokenNameSpanElement = amountInnerDivElement.find(
      ".DappContractOperation-amountTokenName"
    );
    expect(amountTokenNameSpanElement.exists()).to.be.true;
    expect(amountTokenNameSpanElement.text()).to.equals("DHP");
    const amountFiatDivElement = amountInnerDivElement.find(
      ".DappContractOperation-amountFiat"
    );
    expect(amountFiatDivElement.exists()).to.be.true;
    const amountFiatSpanElement = amountFiatDivElement.find("span");
    expect(amountFiatSpanElement.exists()).to.be.true;
    const amountFiat = (+expectedAmount * 0.01).toFixed(2);
    expect(amountFiatSpanElement.text()).to.equals(`≈ ${amountFiat} USD`);
  }
}
