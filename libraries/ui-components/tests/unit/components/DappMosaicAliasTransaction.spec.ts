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
  Address,
  AliasAction,
  MosaicId,
  NamespaceId,
  NetworkType,
  PublicAccount,
  TransactionType,
} from "@dhealth/sdk";

// internal dependencies
import DappAccountAvatar from "@/graphics/DappAccountAvatar/DappAccountAvatar.vue";
import DappTransactionArrow from "@/graphics/DappTransactionArrow/DappTransactionArrow.vue";
import DappMosaicAliasTransaction from "@/graphics/transactions/DappMosaicAliasTransaction/DappMosaicAliasTransaction.vue";
import DappNamespaceCircle from "@/graphics/DappNamespaceCircle/DappNamespaceCircle.vue";
import DappNamespaceUnlinkCircle from "@/graphics/DappNamespaceUnlinkCircle/DappNamespaceUnlinkCircle.vue";
import DappMosaicIcon from "@/graphics/DappMosaicIcon/DappMosaicIcon.vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const transaction = {
  type: TransactionType.MOSAIC_ALIAS,
  network: NetworkType.MAIN_NET,
  version: 1,
  maxFee: "0",
  deadline: "1",
  signature: "test-signature",
  signerPublicKey: PublicAccount.createFromPublicKey(
    "907B74B4EAA4F8DA48162B624C933FD1F3F51714A6EE8A78BB1713F5D6959E0A",
    104
  ),
  aliasAction: AliasAction.Link,
  address: Address.createFromPublicKey(
    "907B74B4EAA4F8DA48162B624C933FD1F3F51714A6EE8A78BB1713F5D6959E0A",
    104
  ),
  namespaceId: NamespaceId.createFromEncoded("9D8930CDBB417337"),
  mosaicId: new MosaicId("39E0C49FA322A459"),
};

const componentOptions = {
  localVue,
  propsData: {
    transaction,
  },
};

describe("DappMosaicAliasTransaction -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappMosaicAliasTransaction as any, componentOptions);
  });

  it("should have correct prop", () => {
    expect(widget.props().transaction).to.deep.equals(transaction);
  });

  it("should display correct elements for link alias operation", () => {
    const mainDivElement = widget.find("div");
    const svgElement = mainDivElement.find("svg");
    const dappAccountAvatarElement =
      svgElement.findComponent(DappAccountAvatar);
    const dappMosaicIconElement = svgElement.findComponent(DappMosaicIcon);
    const dappTransactionArrowElement =
      svgElement.findComponent(DappTransactionArrow);
    const dappNamespaceCircleElement =
      svgElement.findComponent(DappNamespaceCircle);
    const dappNamespaceUnlinkCircle = svgElement.findComponent(
      DappNamespaceUnlinkCircle
    );
    const textElement = svgElement.find("text");
    const titleElement = textElement.find("title");
    expect(mainDivElement.exists()).to.be.true;
    expect(svgElement.exists()).to.be.true;
    expect(dappAccountAvatarElement.exists()).to.be.true;
    expect(dappMosaicIconElement.exists()).to.be.true;
    expect(dappTransactionArrowElement.exists()).to.be.true;
    expect(dappNamespaceCircleElement.exists()).to.be.true;
    expect(dappNamespaceUnlinkCircle.exists()).to.be.false;
    expect(textElement.exists()).to.be.true;
    expect(textElement.classes()).to.include(
      "dappMosaicAliasTransaction-message"
    );
    expect(titleElement.exists()).to.be.true;
  });

  it("should display correct elements for unlink alias operation", () => {
    transaction.aliasAction = AliasAction.Unlink;
    widget = shallowMount(DappMosaicAliasTransaction as any, componentOptions);
    const mainDivElement = widget.find("div");
    const svgElement = mainDivElement.find("svg");
    const dappAccountAvatarElement =
      svgElement.findComponent(DappAccountAvatar);
    const dappMosaicIconElement = svgElement.findComponent(DappMosaicIcon);
    const dappTransactionArrowElement =
      svgElement.findComponent(DappTransactionArrow);
    const dappNamespaceCircleElement =
      svgElement.findComponent(DappNamespaceCircle);
    const dappNamespaceUnlinkCircle = svgElement.findComponent(
      DappNamespaceUnlinkCircle
    );
    const textElement = svgElement.find("text");
    const titleElement = textElement.find("title");
    expect(mainDivElement.exists()).to.be.true;
    expect(svgElement.exists()).to.be.true;
    expect(dappAccountAvatarElement.exists()).to.be.true;
    expect(dappMosaicIconElement.exists()).to.be.true;
    expect(dappTransactionArrowElement.exists()).to.be.true;
    expect(dappNamespaceCircleElement.exists()).to.be.false;
    expect(dappNamespaceUnlinkCircle.exists()).to.be.true;
    expect(textElement.exists()).to.be.true;
    expect(textElement.classes()).to.include(
      "dappMosaicAliasTransaction-message"
    );
    expect(titleElement.exists()).to.be.true;
  });
});
