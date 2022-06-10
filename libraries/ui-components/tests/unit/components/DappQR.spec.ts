/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Unit Tests
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import flushPromises from "flush-promises";
import { expect } from "chai";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";

import { mockObjectQR } from "../../mocks";
import DappQR from "@/widgets/DappQR/DappQR.vue";

// creates local vue instance for tests
const localVue = createLocalVue();

// configure component testing options
const componentOptions = {
  localVue,
  propsData: {
    qrCode: mockObjectQR,
  },
};

describe("DappQR -->", () => {
  let widget: Wrapper<Vue>;
  beforeEach(async () => {
    widget = mount(DappQR, componentOptions);
    await flushPromises(); // awaits *all* promises

    // const b64 = await mockObjectQR.toBase64().toPromise();
    // console.log("base64: ", b64);

    // console.log(widget.find("img").attributes("src"));
    // console.log(widget.find("img").attributes("alt"));
  });

  it("should display QR in <img> tag", async () => {
    //console.log(widget.html());
    expect(widget.find("img")).to.not.be.undefined;
    expect(widget.find("img").attributes("src")).to.not.be.undefined;
    expect(widget.find("img").attributes("alt")).to.not.be.undefined;
  });

  it("should display download button given no custom properties", () => {
    expect(widget.find("dapp-button")).to.not.be.undefined;
    expect(widget.text()).to.be.equal("Download");
  });
});
