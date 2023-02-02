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
  AggregateTransaction,
  AggregateTransactionCosignature,
  PublicAccount,
  Transaction,
  TransactionType,
} from "@dhealth/sdk";
import { Component, Prop } from "vue-property-decorator";

// internal dependencies
import DappAbstractTransaction from "@/graphics/transactions/DappAbstractTransaction/DappAbstractTransaction.vue";
import DappGraphicComponent from "@/graphics/DappGraphicComponent/DappGraphicComponent";

// image resources
import SignatureIcon from "@/assets/img/signature.png";

/**
 * @class DappTransactionGraphic
 * @description This component is the main component to render a visual presentation of a {@link Transaction}.
 * Depending whether the intake transaction is an aggregate transaction or not, this component will render just one,
 * or a list of transactions with different layout and textual/graphic details.
 * Note that this component utilizes and integrates other transaction components.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappGraphicComponent component
 * ```html
 *   <template>
 *     <DappTransactionGraphic
 *      :transaction="some-Transaction-instance"
 *      displayTransactionNumber=true
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {Transaction}    transaction                 The {@link Transaction} instance to be displayed.
 * @param  {boolean}        displayTransactionNumber    The optional flag to set whether to display inner transactions' index number in case the intake transaction is an aggregate transaction.
 *
 * @since v0.1.0
 */
@Component({
  components: { DappAbstractTransaction },
})
export default class DappTransactionGraphic extends DappGraphicComponent {
  /**
   * The required {@link Transaction} instance to be displayed.
   *
   * @access protected
   * @var {Transaction}
   */
  @Prop({
    type: Object,
    required: true,
  })
  protected transaction?: Transaction;

  /**
   * The optional flag to set whether to display inner
   * transactions' index number in case the intake
   * transaction is an aggregate transaction.
   *
   * @access protected
   * @var {boolean}
   */
  @Prop({
    type: Boolean,
    default: false,
  })
  protected displayTransactionNumber?: boolean;

  /**
   * Method to return this component's data object.
   *
   * @access protected
   * @returns {object}
   */
  protected data(): object {
    return {
      TransactionType,
      SignatureIcon,
    };
  }

  /**
   * Getter that checks whether widget is supposed to show.
   *
   * @access protected
   * @returns {boolean}
   */
  protected get isWidgetShown(): boolean {
    if (!this.transaction) return false;
    //return this.isTransactionTypeSupported(this.transaction.type);
    return true;
  }

  /**
   * Getter that checks whether `transaction` prop is aggregate.
   *
   * @access protected
   * @returns {boolean}
   */
  protected get isAggregate(): boolean {
    return (
      this.transaction?.type === TransactionType.AGGREGATE_COMPLETE ||
      this.transaction?.type === TransactionType.AGGREGATE_BONDED
    );
  }

  /**
   * Getter to return aggregate title caption to display.
   *
   * @access protected
   * @returns {string}
   */
  protected get aggregateTitle(): string {
    if (!this.transaction) return "";
    return this.getTransactionTypeCaption(this.transaction.type);
  }

  /**
   * Getter to return aggregate container class name.
   * Returned value will be based on whether this component is displayed
   * on mobile view or not.
   *
   * @access protected
   * @returns {string}
   */
  protected get aggregateContainerClass(): string {
    const isMobile = this.isMobile;

    if (isMobile) return "dappTransactionGraphic-aggregate-container-mobile";
    return "dappTransactionGraphic-aggregate-container";
  }

  /**
   * Getter to get all signers of this component's transaction in case it is
   * of type {@link TransactionType.AGGREGATE_BONDED}.
   * Note that all signer accounts will be displayed as wallet addresses.
   *
   * @access protected
   * @returns {string[]}
   */
  protected get cosigners(): PublicAccount[] {
    if (this.transaction?.type === TransactionType.AGGREGATE_BONDED) {
      return [
        (this.transaction?.signer?.address as any).address,
        ...(this.transaction as AggregateTransaction).cosignatures.map(
          (cosignature: AggregateTransactionCosignature) =>
            (cosignature.signer.address as any).address
        ),
      ];
    }
    return [];
  }

  // protected get loading() {
  //   return this.$store.getters[this.managerGetter].loading;
  // }

  // protected get error() {
  //   return this.$store.getters[this.managerGetter].error;
  // }

  // protected getNameByKey(e) {
  //   return this.$store.getters['ui/getNameByKey'](e);
  // }

  // protected isTransactionTypeSupported(type: TransactionType): boolean {
  //   return !!(this as any).supportedTransactionTypes.find(
  //     (transactionType: TransactionType) => transactionType === type
  //   );
  // }
}
