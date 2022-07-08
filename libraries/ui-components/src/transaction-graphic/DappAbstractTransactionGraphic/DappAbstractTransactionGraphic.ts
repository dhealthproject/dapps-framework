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
import DappTransferGraphic from "@/transaction-graphic/DappTransferGraphic/DappTransferGraphic.vue";
import DappUnknownTransactionGraphic from "../DappUnknownTransactionGraphic/DappUnknownTransactionGraphic.vue";

/**
 * @class DappAbstractTransactionGraphic
 * @description This component display a transaction graphic and depending on
 * the transaction type it will render the according transaction graphic component.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappAbstractTransactionGraphic component
 * ```html
 *   <template>
 *     <DappAbstractTransactionGraphic
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
    DappTransferGraphic,
    DappUnknownTransactionGraphic,
  },
})
export default class DappAbstractTransactionGraphic extends Vue {
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
   * If no component is available for the type, it'll return `"unknown"`.
   *
   * @access protected
   * @returns {string}
   */
  protected get graphicComponent(): string {
    switch (this.transaction?.type) {
      case TransactionType.TRANSFER:
        return "DappTransferGraphic";
    }
    return "unknown";
  }
}
