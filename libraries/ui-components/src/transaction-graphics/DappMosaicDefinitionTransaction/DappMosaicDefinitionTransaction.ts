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
import { MosaicDefinitionTransaction, TransactionType } from "@dhealth/sdk";
import { Component, Prop } from "vue-property-decorator";

// internal dependencies
import DappAccountAvatar from "@/graphics/DappAccountAvatar/DappAccountAvatar.vue";
import DappAddCircle from "@/graphics/DappAddCircle/DappAddCircle.vue";
import DappGraphicComponent from "@/graphics/DappGraphicComponent/DappGraphicComponent";
import DappMosaicIcon from "@/graphics/DappMosaicIcon/DappMosaicIcon.vue";
import DappTransactionArrow from "@/graphics/DappTransactionArrow/DappTransactionArrow.vue";

/**
 * @class DappMosaicDefinitionTransaction
 * @description This component display a transaction graphic that represents
 * a {@link MosaicDefinitionTransaction} instance.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappMosaicDefinitionTransaction component
 * ```html
 *   <template>
 *     <DappMosaicDefinitionTransaction
 *      :transaction="some-MosaicDefinitionTransaction-instance"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {MosaicDefinitionTransaction}    transaction         The {@link MosaicDefinitionTransaction} instance to be displayed.
 *
 * @since v0.1.0
 */
@Component({
  components: {
    DappAccountAvatar,
    DappAddCircle,
    DappTransactionArrow,
    DappMosaicIcon,
  },
})
export default class DappMosaicDefinitionTransaction extends DappGraphicComponent {
  /**
   * The {@link MosaicDefinitionTransaction} instance to be displayed.
   *
   * @access protected
   * @var {MosaicDefinitionTransaction}
   */
  @Prop({
    type: Object,
    required: true,
  })
  protected transaction?: MosaicDefinitionTransaction;

  /**
   * Getter to return this component's transaction type caption.
   *
   * @access protected
   * @return {string}
   */
  protected get transactionType(): string {
    return this.getTransactionTypeCaption(TransactionType.MOSAIC_DEFINITION);
  }

  /**
   * Getter to return this component's flag to display circle icons.
   *
   * @access protected
   * @return {boolean[]}
   */
  protected get circleIconsToDisplay(): boolean[] {
    return [true];
  }

  /**
   * Getter to return this component's mosaic object.
   *
   * @access protected
   * @returns {object}
   */
  protected get mosaic(): object {
    return { mosaicId: this.transaction?.mosaicId.toHex() };
  }

  /**
   * Getter to return this component's mosaic definition content object.
   *
   * @access protected
   * @var {object}
   */
  protected get content(): object {
    return {
      divisibility: this.transaction?.divisibility,
      duration: this.transaction?.duration.toString(),
      supplyMutable: this.transaction?.flags.supplyMutable,
      transferable: this.transaction?.flags.transferable,
      restrictable: this.transaction?.flags.restrictable,
    };
  }

  /**
   * Getter to return this component's transaction signer.
   *
   * @access protected
   * @returns {string}
   */
  protected get signer(): string {
    if (!this.transaction || !this.transaction.signer) return "undefined";
    return this.transaction?.signer?.address.plain();
  }
}
