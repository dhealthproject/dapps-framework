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
import DappDate from "@/fields/DappDate/DappDate.vue";
import sinon from "sinon";
import { expect } from "chai";
import moment from "moment";
import { VueConstructor } from "vue";

// creates local vue instance for tests
const localVue = createLocalVue();
const componentOptions: {
  localVue: VueConstructor<Vue>;
  propsData?: object;
} = {
  localVue,
};

describe("DappDate -->", () => {
  let widget: Wrapper<Vue>;
  const sandbox = sinon.createSandbox();
  const now = new Date(1655683200);
  let clock: any;

  beforeEach(() => {
    clock = sinon.useFakeTimers(now.getTime());
    const propsData = {
      timestamp: new Date().getTime(),
      isShowTimestamp: true,
    };
    componentOptions.propsData = propsData;
    widget = shallowMount(DappDate as any, componentOptions);
  });

  afterEach(() => {
    sandbox.restore();
    clock.restore();
  });

  it("should display correct date text without timestamp", () => {
    const propsData = {
      timestamp: new Date().getTime(),
      isShowTimestamp: false,
    };
    componentOptions.propsData = propsData;
    widget = shallowMount(DappDate as any, componentOptions);
    expect(widget.text()).to.equals(
      moment.utc(now.getTime() * 1000).format("YYYY-MM-DD HH:mm:ss")
    );
  });

  it("should display correct date text with timestamp", () => {
    expect(widget.text()).to.equals(
      moment.utc(now.getTime() * 1000).format("YYYY-MM-DD HH:mm:ss") +
        now.getTime()
    );
  });

  it("timestamp span should have correct css class", () => {
    expect(widget.findAll("span").at(1).classes()).to.contain(
      "dapp-date-style-timestamp"
    );
  });
});
