/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Unit Tests
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { QRCodeGenerator } from "@dhealth/qr-library";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { expect } from "chai";
import flushPromises from "flush-promises";

import DappQR from "@/widgets/DappQR/DappQR.vue";
import { mockObjectQR, mockObjectQRBase64 } from "../../mocks";

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
  // any is needed here to permit calls to component methods
  let widget: any;
  beforeEach(async () => {
    widget = mount(DappQR, componentOptions);
    await flushPromises(); // awaits *all* promises
  });

  it("should display QR Code in <img> tag", () => {
    expect(widget.find("img")).to.not.be.undefined;
    expect(widget.find("img").attributes("src")).to.not.be.undefined;
    expect(widget.find("img").attributes("alt")).to.not.be.undefined;
  });

  it("should display download button given no custom properties", () => {
    expect(widget.find("a")).to.not.be.undefined;
    expect(widget.find("a").exists()).to.be.equal(true);
    expect(widget.text()).to.be.equal("Download");
  });

  it("should get correct Base64 content after component creation", async () => {
    expect(await widget.vm.getBase64()).to.be.equal(mockObjectQRBase64);
  });

  it("should get different Base64 content given different QR Code body", async () => {
    // creates an *object* QR Code with fake key-value content
    const mockObjectQR2 = QRCodeGenerator.createExportObject(
      { test: "value2" },
      104,
      "empty2"
    );

    // prepare
    widget.setProps({ qrCode: mockObjectQR2 });
    await flushPromises(); // awaits *all* promises

    // act
    const actual = await widget.vm.getBase64();

    // assert
    expect(actual).to.not.be.undefined;
    expect(actual).to.not.be.equal(mockObjectQRBase64);
  });

  it("should use default filename and extension for downloads", async () => {
    expect(widget.find("a")).to.not.be.undefined;
    expect(widget.find("a").exists()).to.be.equal(true);
    expect(widget.find("a").attributes("download")).to.not.be.undefined;
    expect(widget.find("a").attributes("download")).to.be.equal(
      "dhealth_dapp_qrcode.png"
    );
  });

  it("should use correct filename and extension for downloads given property", async () => {
    // prepare
    widget.setProps({ downloadName: "testing" });
    await flushPromises(); // awaits *all* promises

    // act
    const actual = widget.vm.getFilename();

    // assert
    expect(actual).to.not.be.undefined;
    expect(actual).to.be.equal("testing.png");
  });
});
