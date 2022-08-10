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
import { Mosaic, MosaicId, UInt64 } from "@dhealth/sdk";
import { Component, Prop, Vue } from "vue-property-decorator";

// internal dependencies
import DappInput from "../DappInput/DappInput.vue";

/**
 * @class DappMosaic
 * @description This component displays an `DappInput` field with a configurable
 * left icon. Input value will be in format:
 * <br /><br />
 * ```js
 *  `${mosaic.amount} ${mosaicName}`
 * ```
 * <br /><br />
 * You can customize the look&feel of this components with
 * [component properties](#parameters).
 * <br /><br />
 * @example Using the DappMosaic component.
 * <br /><br />
 * ```html
 *  <template>
 *    <DappMosaic
 *      :value="some mosaic object"
 *      iconSrc="url to left icon image"
 *      mosaicName="some mosaic name (e.g. DHP, FIT etc.)"
 *    />
 *  </template>
 * ```
 * <br /><br />
 * #### Parameters
 *
 * @param  {Mosaic}    value                The required `value` to be put inside the input element.
 * @param  {string}    iconSrc              The required `src` value of the left icon image.
 * @param  {string}    mosaicName           The optional mosaic name to be displayed after the amount inside the input element.
 *
 * @since v0.2.0
 */
@Component({
  components: {
    DappInput,
  },
})
export default class DappMosaic extends Vue {
  /**
   * The required `value` to be put inside the input element.
   *
   * @access protected
   * @var {Mosaic}
   */
  @Prop({
    type: Object,
    required: true,
  })
  protected value: Mosaic = new Mosaic(
    new MosaicId("39E0C49FA322A459"), // by default init to `dhealth.dhp`
    UInt64.fromUint(0) // with 0 amount
  );

  /**
   * The required `src` value of the left icon image.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
    required: true,
  })
  protected iconSrc?: string;

  /**
   * The optional mosaic name to be displayed after the amount inside the input element.
   *
   * @access protected
   * @var {string}
   */
  @Prop()
  protected mosaicName?: string;

  /**
   * Getter method to access the *formatted* input value. After formatting,
   * the value will contain a *mosaic name* as defined in {@link mosaicName} or
   * using the underlying {@link Mosaic} mosaic.
   *
   * @returns {string}
   */
  protected get formattedValue(): string {
    // use `Mosaic` to get amount
    // @todo this is not protected for number overflows
    const formattedValue: number = this.value.amount.compact();

    // @todo extract the number of decimals to Asset type
    return `${formattedValue.toFixed(2)} ${this.getMosaicName(this.value)}`;
  }

  /**
   * Method to return mosaic name/id to be displayed after amount inside the input element.
   * If `this.mosaicName` is not available, use `this.mosaic.id.id.toHex()`.
   *
   * @access public
   * @param {Mosaic} mosaic
   * @returns {string}
   */
  public getMosaicName(mosaic: Mosaic): string {
    return this.mosaicName ? this.mosaicName : mosaic.id.id.toHex();
  }
}
