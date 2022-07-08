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
import { Mosaic } from "@dhealth/sdk";

// internal dependencies
import DappGraphicComponent from "../DappGraphicComponent/DappGraphicComponent";

/**
 * @class DappMosaicCircle
 * @description This component renders a mosaic circle icon
 * that can be put in other transaction graphic components.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappMosaicCircle component
 * ```html
 *   <template>
 *     <DappMosaicCircle
 *      :mosaics="some-Mosaic-array"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {Mosaic[]}    mosaics         The {@link Mosaic} array to be displayed.
 *
 * @since v0.1.0
 */
@Component({})
export default class DappMosaicCircle extends DappGraphicComponent {
  /**
   * The {@link Mosaic} array to be displayed.
   *
   * @access protected
   * @var {Mosaic[]}
   */
  @Prop({
    type: Array,
    default: [],
    required: true,
  })
  mosaics?: Mosaic[];

  /**
   * Method to return this component's data object.
   *
   * @access protected
   * @returns {object}
   */
  protected data(): any {
    return {
      id: this.getId("mosaics-circle"),
    };
  }

  /**
   * Checks if this component has mosaic.
   *
   * @access protected
   * @returns {boolean}
   */
  protected get hasMosaic(): boolean {
    if (!this.mosaics) return false;
    return this.mosaics.length > 0;
  }

  /**
   * Returns the title content (displayed when hover) of this component.
   *
   * @access protected
   * @returns {string}
   */
  protected get mosaicsTitle(): string {
    if (!this.mosaics) return "";
    return JSON.stringify(this.mosaics, null, 2);
  }
}
