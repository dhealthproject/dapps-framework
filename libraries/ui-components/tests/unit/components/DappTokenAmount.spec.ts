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
import { mount, VueWrapper } from "@vue/test-utils";
import DappTokenAmount from "@/fields/DappTokenAmount/DappTokenAmount.vue";

describe("DappTokenAmount -->", () => {
  let widget: VueWrapper;
  beforeEach(() => {
    widget = mount(DappTokenAmount as any, {
      props: { value: 0 },
    });
  });

  it("should display 0 without decimals", () => {
    expect(widget.text()).to.include("0");
  });
});
