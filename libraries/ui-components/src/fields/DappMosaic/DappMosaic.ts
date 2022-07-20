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
import { Mosaic } from "@dhealth/sdk";
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
 * @param  {Mosaic}    value                The optional `value` to be put inside the input element.
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
   * The optional `value` to be put inside the input element.
   *
   * @access protected
   * @var {Mosaic}
   */
  @Prop({
    type: Object,
    required: true,
  })
  protected value?: Mosaic;

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
