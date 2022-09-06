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
import DappAccountDetails from "@/graphics/DappAccountDetails/DappAccountDetails.vue";
import {
  AccountInfo,
  AccountType,
  Address,
  Mosaic,
  MosaicId,
  SupplementalPublicKeys,
  UInt64,
} from "@dhealth/sdk";
import { Asset } from "@/types/Asset";

// creates local vue instance for tests
const localVue = createLocalVue();

const accountInfo: AccountInfo = new AccountInfo(
  1,
  "6239B5092964C674D8CF25C4",
  Address.createFromRawAddress("NDHPCJ6X4V7VZKCUUZBX3JU5QDPIOBKHCGIYQWA"),
  UInt64.fromUint(1),
  "907B74B4EAA4F8DA48162B624C933FD1F3F51714A6EE8A78BB1713F5D6959E0A",
  UInt64.fromUint(1),
  AccountType.Unlinked,
  new SupplementalPublicKeys(),
  [],
  [new Mosaic(new MosaicId("39E0C49FA322A459"), UInt64.fromUint(1000000))],
  UInt64.fromUint(0),
  UInt64.fromUint(0)
);

const accountName = "Test Account";

const asset: Asset = {
  mosaicId: "39E0C49FA322A459",
  label: "$FIT",
  inputDecimals: 6,
  outputDecimals: 0,
};

const direction = "up";

const slots = {
  count: "<div>count-content</div>",
  icon: "<div>icon-content</div>",
  information: "<div>information-content</div>",
  value: "<div>value-content</div>",
  actions: "<div>actions-content</div>",
};

const componentOptions = {
  localVue,
  propsData: {
    accountInfo,
    accountName,
    asset,
    direction,
  },
};

describe("DappAccountDetails -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(() => {
    widget = shallowMount(DappAccountDetails as any, componentOptions);
  });

  it("should have correct properties", () => {
    expect(widget.props().variant).to.equals("primary");
    expect(widget.props().accountInfo).to.equals(accountInfo);
    expect(widget.props().accountName).to.equals(accountName);
    expect(widget.props().asset).to.equals(asset);
    expect(widget.props().direction).to.equals(direction);
  });

  it("should always add base CSS class", () => {
    expect(widget.find("div").classes()).to.contain("dappAccountDetails-base");
  });

  it("should add style-primary CSS class given default variant", () => {
    expect(widget.find("div").classes()).to.contain("dappAccountDetails-base");
    expect(widget.find("div").classes()).to.contain(
      "dappAccountDetails-style-primary"
    );
  });

  it("should add correct CSS class given different variants", () => {
    ["primary", "secondary", "tertiary"].forEach((variant: string) => {
      // prepare
      // overwrites "variant" property
      widget = shallowMount(DappAccountDetails as any, {
        ...componentOptions,
        propsData: {
          accountInfo,
          accountName,
          asset,
          direction,
          variant,
        },
      });

      // assert
      expect(widget.find("div").classes()).to.contain(
        "dappAccountDetails-base"
      );
      expect(widget.find("div").classes()).to.contain(
        `dappAccountDetails-style-${variant}`
      );
    });
  });

  it("should render default slot contents", () => {
    // prepare
    // adds non-default "slots" to widget
    widget = shallowMount(DappAccountDetails as any, {
      ...componentOptions,
      propsData: {
        accountInfo,
        accountName,
        asset,
        direction,
      },
      slots: {
        count: slots.count,
        icon: slots.icon,
        action: slots.actions,
      },
    });

    // assert
    expect(widget.find(".dappAccountDetails-information").exists()).to.be.true;
    expect(widget.find(".dappAccountDetails-value").exists()).to.be.true;
  });

  it("should render injected slots", () => {
    // prepare
    // adds "slots" to widget
    widget = shallowMount(DappAccountDetails as any, {
      ...componentOptions,
      propsData: {
        accountInfo,
        accountName,
        asset,
        direction,
      },
      slots,
    });

    // assert
    for (const key in slots) {
      expect(widget.html()).to.includes(`${key}-content`);
    }
    expect(widget.find(".dappAccountDetails-information").exists()).to.be.false;
    expect(widget.find(".dappAccountDetails-value").exists()).to.be.false;
  });
});
