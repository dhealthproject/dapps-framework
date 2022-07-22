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
import { Component, Prop, Vue } from "vue-property-decorator";
import { Transaction, TransactionType } from "@dhealth/sdk";

// internal dependencies
import DappTransferTransaction from "../DappTransferTransaction/DappTransferTransaction.vue";
import DappUnknownTransaction from "../DappUnknownTransaction/DappUnknownTransaction.vue";
import DappMosaicAliasTransaction from "../DappMosaicAliasTransaction/DappMosaicAliasTransaction.vue";
import DappMosaicDefinitionTransaction from "../DappMosaicDefinitionTransaction/DappMosaicDefinitionTransaction.vue";
import DappMosaicSupplyChangeTransaction from "../DappMosaicSupplyChangeTransaction/DappMosaicSupplyChangeTransaction.vue";

/**
 * @class DappAbstractTransaction
 * @description This component display a transaction graphic and depending on
 * the transaction type it will render the according transaction graphic component.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappAbstractTransaction component
 * ```html
 *   <template>
 *     <DappAbstractTransaction
 *      :transaction="someTransactionInstance"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {Transaction}    transaction         The {@link Transaction} instance to be displayed.
 *
 * @since v0.1.0
 */
@Component({
  components: {
    DappTransferTransaction,
    DappUnknownTransaction,
    DappMosaicAliasTransaction,
    DappMosaicDefinitionTransaction,
    DappMosaicSupplyChangeTransaction,
  },
})
export default class DappAbstractTransaction extends Vue {
  /**
   * The {@link Transaction} instance to be displayed.
   *
   * @access protected
   */
  @Prop({
    type: Object,
    required: true,
  })
  protected transaction?: Transaction;

  /**
   * Method to return this component's data object.
   *
   * @returns {object}
   */
  protected data(): object {
    return {
      TransactionType,
    };
  }

  /**
   * Getter method to return the transaction graphic component's
   * tag name depending on the {@link TransactionType}.
   * If no component is available for the type, it'll return `"DappUnknownTransaction"`.
   * <br /><br />
   * Note this is the default component to display non-identified-type transactions.
   *
   * @access protected
   * @returns {string}
   */
  protected get graphicComponent(): string {
    switch (this.transaction?.type) {
      case TransactionType.TRANSFER:
        return "DappTransferTransaction";
      case TransactionType.ADDRESS_ALIAS:
        return "DappAddressAliasTransaction";
      case TransactionType.MOSAIC_ALIAS:
        return "DappMosaicAliasTransaction";
      case TransactionType.MOSAIC_DEFINITION:
        return "DappMosaicDefinitionTransaction";
      case TransactionType.MOSAIC_SUPPLY_CHANGE:
        return "DappMosaicSupplyChangeTransaction";
    }
    return "DappUnknownTransaction";
  }
}
