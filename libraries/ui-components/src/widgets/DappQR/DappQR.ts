/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { QRCode } from "@dhealth/qr-library";
import { Component, Prop, Vue } from "vue-property-decorator";
import _ from "lodash";

// internal dependencies
import type { Variant } from "@/types/Variant";

// child components
import { DappButton } from "@/components";

/**
 * @class DappQR
 * @description This component displays an authentication QR
 * code that can be scanned using dHealth Mobile Wallet or
 * dHealth Signer. The purpose of this QR code is to identify
 * a dHealth Network Account ("login").
 * <br /><br />
 * You can customize the look&feel of this components with
 * [component properties](#parameters).
 * <br /><br />
 * Caution that the {@link downloadName} parameter must have
 * a `PNG` file extension. If you omit it, the component will
 * automatically add it at the end.
 * <br /><br />
 * Note that this component defines 1 slot that can be used to
 * overwrite the download button.
 * | Slot | Description |
 * | --- | --- |
 * | `download` | Defines the download button markup. If no value is provided, the component uses a <dapp-button>. |
 * <br /><br />
 * @example Using the DappQR component with variants
 * Variants that are available with the components library
 * can take up values as defined in {@link Variant}.
 * <br /><br />
 * ```html
 *   <template>
 *     <DappQR
 *       qrCode="QRCodeGenerator.createExportTransaction(...)"
 *       variant="primary"
 *       with-download="true"
 *       download-name="your_awesome_dapp_contract.png"
 *     />
 *   </template>
 * ```
 * <br /><br />
 * #### Parameters
 *
 * @param  {Variant}     variant           The optional design variant (defaults to `"primary"`).
 * @param  {QRCode}      qrCode            The *required* QR Code instance that will be displayed (defaults to an empty object).
 * @param  {boolean}     withDownload      An optional boolean to determine if a download button is displayed (defaults to `true`).
 * @param  {string}      downloadName      An optional name for the downloaded PNG binary file (defaults to `"dhealth_dapp_qrcode.png"`).
 *
 * @since v0.1.0
 */
@Component({
  // Defines child components that must be lazy-loaded with
  // the rendering process of this component. All component
  // options are static class properties.
  components: {
    DappButton,
  },
})
export default class DappQR extends Vue {
  /**
   * The optional design variant (defaults to `"primary"`).
   *
   * @access protected
   * @var {Variant}
   */
  @Prop({ default: "primary" })
  protected variant?: Variant;

  /**
   * The *required* QR Code instance that will be displayed
   * (defaults to an empty object).
   *
   * @access protected
   * @var {QRCode}
   */
  @Prop({ default: undefined, required: true })
  protected qrCode?: QRCode;

  /**
   * An optional boolean to determine if a download button
   * is displayed or not (defaults to `true`).
   *
   * @access protected
   * @var {boolean}
   */
  @Prop({ default: true })
  protected withDownload?: boolean;

  /**
   * An optional name for the downloaded PNG binary file
   * (defaults to `"dhealth_dapp_qrcode.png"`).
   *
   * @access protected
   * @var {string}
   */
  @Prop({ default: "dhealth_dapp_qrcode.png" })
  protected downloadName?: string;

  /**
   * The QR Code base64 content. This property contains the
   * actual QR Code body, encoded using the Base64 character
   * set.
   * <br /><br />
   * Note that the content of this property is used *directly*
   * inside the rendered <img> tag's `src` attribute.
   *
   * @access protected
   * @var {string}
   */
  protected qrCodeBase64$ = "Unknown";

  /**
   * Internal helper that is used to debounce calls to the
   * {@link getBase64} method. This is necessary to wait a
   * minimal amount of time before re-generating the QR Code.
   *
   * @access protected
   * @var {function}
   */
  protected debouncedFnGetBase64: any = undefined;

  /**
   * The component creation hook.  It creates a debounced
   * function pointer to {@link getBase64} such that updates
   * are delayed for 200 milliseconds.
   *
   * @internal
   * @access public
   */
  public async created(): Promise<void> {
    this.debouncedFnGetBase64 = _.debounce(this.getBase64, 200);

    // configure content watch
    this.$watch("qrCode", () => {
      this.debouncedFnGetBase64();
    });

    // initialize base64 content
    try {
      await this.debouncedFnGetBase64();
    } catch (e) {}

    // fixes download name extension
    if (
      this.downloadName !== undefined &&
      null == this.downloadName?.match(/\.png$/)
    ) {
      this.downloadName = `${this.downloadName}.png`;
    }
  }

  public dumpJSON(): void {
    console.log(this.safeQrCode.toJSON());
  }

  protected get safeQrCode(): QRCode {
    return undefined === this.qrCode ? ({} as QRCode) : this.qrCode;
  }

  /**
   * Encode the {@link qrCode} object using Base64 encoding
   * such that it can be directly added to a <img> tag's
   * `src` attribute.
   * <br /><br />
   * This method returns an observable that returns a `string`
   * upon completion.
   *
   * @access public
   * @returns {Promise<string>}
   */
  public getBase64(): Promise<string> {
    return this.safeQrCode
      .toBase64()
      .toPromise()
      .then((base64: string) => (this.qrCodeBase64$ = base64))
      .catch((err: any) => {
        throw new Error(err);
      });
  }
}
