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
import { Component, Prop } from "vue-property-decorator";

// internal dependencies
import DappGraphicComponent from "../DappGraphicComponent/DappGraphicComponent";

/**
 * @class DappMosaicIcon
 * @description This component displays a mosaic icon
 * and depends on the value of its id the icon will
 * be rendered in different color.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappMosaicIcon component
 * ```html
 *   <template>
 *     <DappMosaicIcon
 *       :width="123"
 *       :height="123"
 *       :mosaic="some-mosaic-object"
 *       :hideCaption="true"
 *     />
 *   </template>
 * ```
 * <br /><br />
 * @example Using the DappMosaicIcon component
 * ```html
 *   <template>
 *     <DappMosaicIcon
 *       :width="123"
 *       :height="123"
 *       mosaicId="mosaic-id"
 *       aliasName="mosaic-name"
 *       :hideCaption="true"
 *     />
 *   </template>
 * ```
 * <br /><br />
 * #### Parameters
 *
 * @param  {number}     width           The optional icon width value (defaults to `261.333`).
 * @param  {number}     height          The optional icon height value (defaults to `131.313`).
 * @param  {object}     mosaic          The optional mosaic object.
 * @param  {string}     mosaicId        The optional mosaic mosaicId value.
 * @param  {string}     aliasName       The optional mosaic aliasName value.
 * @param  {boolean}    hideCaption     The optional icon hideCaption flag (defaults to `false`).
 *
 * @since v0.1.0
 */
@Component({})
export default class DappMosaicIcon extends DappGraphicComponent {
  /**
   * The optional icon width value (defaults to `261.333`).
   *
   * @access protected
   * @var {number}
   */
  @Prop({
    type: Number,
    default: 261.333,
  })
  protected width?: number;

  /**
   * The optional icon height value (defaults to `131.313`).
   *
   * @access protected
   * @var {number}
   */
  @Prop({
    type: Number,
    default: 131.313,
  })
  protected height?: number;

  /**
   * The optional mosaic object.
   *
   * @access protected
   * @var {{ mosaicId: string, aliasName: string }}
   */
  @Prop({
    type: Object,
    default: {
      mosaicId: "",
      aliasName: "",
    },
  })
  protected mosaic?: { mosaicId: string; aliasName: string };

  /**
   * The optional mosaic mosaicId value.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
  })
  protected mosaicId?: string;

  /**
   * The optional mosaic aliasName value.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
  })
  protected aliasName?: string;

  /**
   * The optional icon hideCaption flag (defaults to `false`).
   *
   * @access protected
   * @var {boolean}
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  protected hideCaption?: boolean;

  /**
   * Computed method to return display title.
   *
   * @access protected
   * @returns {string}
   */
  protected get title(): string {
    return (
      this.aliasName ||
      this.mosaic?.aliasName ||
      this.mosaicId ||
      this.mosaic?.mosaicId ||
      ""
    );
  }

  /**
   * Computed method to return icon color.
   *
   * @access protected
   * @returns {string}
   */
  protected get iconColor(): string {
    let mosaicId;
    if (this.mosaicId) mosaicId = this.mosaicId;
    else if (this.mosaic && this.mosaic.mosaicId)
      mosaicId = this.mosaic.mosaicId;
    else return "RGB(0, 0, 0)";
    return this.getIconColorFromHex(mosaicId);
  }

  /**
   * Computed method to return display this component's
   * mosaic id in truncated format.
   *
   * @access protected
   * @returns {string}
   */
  protected get truncatedMosaicId(): string {
    if ((!this.mosaicId && !this.mosaic) || !this.mosaic?.mosaicId) return "";
    return this.truncString(this.mosaicId || this.mosaic.mosaicId);
  }

  /**
   * Computed method to return display this component's
   * mosaic name in truncated format.
   *
   * @access protected
   * @returns {string}
   */
  protected get truncatedMosaicName(): string {
    const aliasName = this.aliasName || this.mosaic?.aliasName;
    const mosaicId = this.mosaicId || this.mosaic?.mosaicId;

    if (aliasName) return this.truncString(aliasName, 5);
    if (mosaicId) return this.truncString(mosaicId);
    return "";
  }

  /**
   * Computed method to return this svg's display viewBox attribute.
   * Value will be set depending on `hideCaption` prop value.
   *
   * @access protected
   * @returns {string}
   */
  protected get viewBox(): string {
    return this.hideCaption ? "115 0 16 105" : "0 0 261.333 131.313";
    // 0 0 116 105
  }
}
