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
import {
  Message,
  Mosaic,
  PublicAccount,
  TransferTransaction,
} from "@dhealth/sdk";

// internal dependencies
import DappGraphicComponent from "@/graphics/DappGraphicComponent/DappGraphicComponent";
import DappAccountAvatar from "@/graphics/DappAccountAvatar/DappAccountAvatar.vue";
import DappMessageCircle from "@/graphics/DappMessageCircle/DappMessageCircle.vue";
import DappMosaicCircle from "@/graphics/DappMosaicCircle/DappMosaicCircle.vue";
import DappTransactionArrow from "@/graphics/DappTransactionArrow/DappTransactionArrow.vue";

/**
 * @class DappTransferGraphic
 * @description This component display a transaction graphic that represents
 * a {@link TransferTransaction} instance.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappTransferGraphic component
 * ```html
 *   <template>
 *     <DappTransferGraphic
 *      :transaction="someTransferTransactionInstance"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {TransferTransaction}    transaction         The {@link TransferTransaction} instance to be displayed.
 *
 * @since v0.1.0
 */
@Component({
  components: {
    DappAccountAvatar,
    DappMessageCircle,
    DappMosaicCircle,
    DappTransactionArrow,
  },
})
export default class DappTransferGraphic extends DappGraphicComponent {
  /**
   * The {@link TransferTransaction} instance to be displayed.
   *
   * @access protected
   * @var {TransferTransaction}
   */
  @Prop({
    type: Object,
    required: true,
  })
  protected transaction?: TransferTransaction;

  /**
   * Getter to return the transaction type (in string).
   *
   * @access protected
   * @returns {string}
   */
  protected get transactionType(): string {
    return this.getTransactionTypeCaption(16724); // Transfer
  }

  /**
   * Getter to return the circle icons to be displayed.
   *
   * @access protected
   * @returns {boolean[]}
   */
  protected get circleIconsToDisplay(): boolean[] {
    return [this.hasMessage, this.hasMosaic, this.hasNativeMosaic];
  }

  /**
   * Getter to return a boolean indicating whether the
   * component's transaction contains message content.
   *
   * @access protected
   * @returns {boolean}
   */
  protected get hasMessage(): boolean {
    if (!this.message) return false;
    return (
      typeof this.message.payload === "string" &&
      this.message.payload.length > 0
    );
  }

  /**
   * Getter to return a boolean indicating whether the
   * component's transaction contains the network's native mosaic.
   * Note that currently it is temporarily set to false by default.
   *
   * @access protected
   * @returns {boolean}
   */
  protected get hasNativeMosaic(): boolean {
    // return typeof this.nativeMosaic !== 'undefined';
    return false;
  }

  /**
   * Getter to return a boolean indicating whether the
   * component's transaction contains any mosaic.
   *
   * @access protected
   * @returns {boolean}
   */
  protected get hasMosaic(): boolean {
    return this.mosaicList.length > 0;
  }

  // protected get nativeMosaic() {
  // 	if (!this.mosaics) return null;
  // 	return this.mosaics.find(
  // 		mosaic => mosaic.mosaicId === this.nativeMosaicId
  // 	);
  // }

  /**
   * Getter to return the list of mosaics in this component's transaction.
   *
   * @access protected
   * @returns {Mosaic[]}
   */
  protected get mosaicList(): Mosaic[] {
    // return this.mosaics.filter(
    // 	mosaic => mosaic.mosaicId !== this.nativeMosaicId
    // );
    return this.mosaics ? this.mosaics : [];
  }

  /**
   * Getter to return the {@link Message} instance of this component's transaction.
   *
   * @access protected
   * @returns {Message | undefined}
   */
  protected get message(): Message | undefined {
    return this.transaction?.message;
  }

  /**
   * Getter to return the transaction's `signer`.
   *
   * @access protected
   * @returns {PublicAccount}
   */
  protected get signer(): PublicAccount {
    // return this.transaction?.signer?.address.plain();
    return (this.transaction?.signer?.address as any).address;
  }

  /**
   * Getter to return the transaction's recipient's address.
   *
   * @access protected
   * @returns {string}
   */
  protected get recipient(): string {
    // return this.transaction?.recipientAddress.plain();
    return (this.transaction?.recipientAddress as any).address;
  }

  /**
   * Getter to return the list of mosaics in this component's transaction.
   *
   * @access protected
   * @returns {Mosaic[]}
   */
  protected get mosaics() {
    return this.transaction?.mosaics;
  }
}
