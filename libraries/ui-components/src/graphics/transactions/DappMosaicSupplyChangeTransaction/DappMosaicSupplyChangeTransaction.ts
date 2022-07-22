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
import {
  MosaicSupplyChangeAction,
  MosaicSupplyChangeTransaction,
  TransactionType,
} from "@dhealth/sdk";
import { Component, Prop } from "vue-property-decorator";

// internal dependencies
import DappGraphicComponent from "@/graphics/DappGraphicComponent/DappGraphicComponent";
import DappAccountAvatar from "@/graphics/DappAccountAvatar/DappAccountAvatar.vue";
import DappEditCircle from "@/graphics/DappEditCircle/DappEditCircle.vue";
import DappTransactionArrow from "@/graphics/DappTransactionArrow/DappTransactionArrow.vue";
import DappMosaicIcon from "@/graphics/DappMosaicIcon/DappMosaicIcon.vue";

/**
 * @class DappMosaicSupplyChangeTransaction
 * @description This component display a transaction graphic that represents
 * a {@link MosaicSupplyChangeTransaction} instance.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappMosaicSupplyChangeTransaction component
 * ```html
 *   <template>
 *     <DappMosaicSupplyChangeTransaction
 *      :transaction="some-MosaicSupplyChangeTransaction-instance"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {MosaicSupplyChangeTransaction}    transaction         The {@link MosaicSupplyChangeTransaction} instance to be displayed.
 *
 * @since v0.1.0
 */
@Component({
  components: {
    DappAccountAvatar,
    DappEditCircle,
    DappTransactionArrow,
    DappMosaicIcon,
  },
})
export default class DappMosaicDefinitionTransaction extends DappGraphicComponent {
  /**
   * The {@link MosaicSupplyChangeTransaction} instance to be displayed.
   *
   * @access protected
   * @var {MosaicSupplyChangeTransaction}
   */
  @Prop({
    type: Object,
    required: true,
  })
  protected transaction?: MosaicSupplyChangeTransaction;

  /**
   * Getter to return this component's transaction type caption.
   *
   * @access protected
   * @return {string}
   */
  protected get transactionType(): string {
    return this.getTransactionTypeCaption(TransactionType.MOSAIC_SUPPLY_CHANGE);
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
    if (!this.transaction) return {};
    return {
      mosaicId: this.transaction?.mosaicId.toHex(),
      delta: this.transaction?.delta.toString(),
      action: MosaicSupplyChangeAction[this.transaction?.action],
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
