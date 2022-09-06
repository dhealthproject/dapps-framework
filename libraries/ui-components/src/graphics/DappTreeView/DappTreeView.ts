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
import { MessageType, NetworkType, TransactionType } from "@dhealth/sdk";
import DappGraphicComponent from "../DappGraphicComponent/DappGraphicComponent";
import { ZoneId } from "@js-joda/core";

/**
 * @class DappTreeView
 * @description This component display a generic tree items graphic for any object/array/value.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappAbstractTransactionGraphic component
 * ```html
 *   <template>
 *     <DappTreeView
 *      name="someName"
 *      :item="someValue"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {string}         name         The field name of the item to be displayed.
 * @param  {any}            item         An object/array/value instance to be displayed.
 *
 * @since v0.1.0
 */
@Component({})
export default class DappTreeView extends DappGraphicComponent {
  /**
   * An object/array/value instance to be displayed.
   *
   * @access protected
   * @var {any}
   */
  @Prop({
    required: true,
  })
  protected item?: any;

  /**
   * The field name of the item to be displayed.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
    required: true,
  })
  protected name?: string;

  /**
   * Method to return this component's data object.
   *
   * @access protected
   * @returns {object}
   */
  protected data(): object {
    return {
      isOpen: false,
    };
  }

  /**
   * Getter to check if this component's item is expandable (is object or array)
   * and hence to be displayed recursively.
   *
   * @access protected
   * @returns {boolean}
   */
  protected get isExpandable(): boolean {
    return this.formatItem instanceof Object || this.item instanceof Array;
  }

  /**
   * Getter to return a formatted value of the item.
   * These checks are based on a transaction's field values.
   *
   * @access protected
   * @returns {unknown}
   */
  protected get formatItem(): unknown {
    if (this.item === undefined) return "undefined";
    if (this.name === "type" && MessageType[this.item])
      return MessageType[this.item];
    if (this.name === "type" && TransactionType[this.item])
      return TransactionType[this.item];
    if (this.name === "networkType") return NetworkType[this.item];
    if (!isNaN(this.item.lower)) return this.item.toString();
    if (this.item.address) {
      if (this.item.address.plain) return this.item.address.plain();
      else return this.item.address;
    }
    if (this.item.adjustedValue)
      return this.item
        .toLocalDateTimeGivenTimeZone(1616978397, ZoneId.UTC)
        .toString();
    if (this.name === "id" && this.item.id) return this.item.id.toString();
    return this.item;
  }

  /**
   * Method to toggle this component's `isOpen` state.
   *
   * @access protected
   * @returns {void}
   */
  protected toggle(): void {
    if (this.isExpandable) {
      this.$data.isOpen = !this.$data.isOpen;
    }
  }
}
