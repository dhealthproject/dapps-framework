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
import { Asset } from "@/types/Asset";
import { Address, MessageType, TransferTransaction } from "@dhealth/sdk";
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * @class DappTransferTransaction
 * @description This component displays a graphic presentation
 * of a {@link TransferTransaction} instance, with different
 * adjustments for each contract type if the transaction is a
 * contract transaction.
 * <br /><br />
 * You can customize the look&feel of this components with adjusting the props.
 * <br /><br />
 * @example Using the DappIcon component with sizes
 * Sizes that are available with the components library
 * can take up values as defined in {@link Size}.
 * <br /><br />
 * ```html
 *  <template>
 *    <DappTransferTransaction
 *      :transaction="some-TransferTransaction-var"
 *      senderName="some-sender-name"
 *      recipientName="some-recipient-name"
 *      displayAddresses="true"
 *    />
 *  </template>
 * ```
 * <br /><br />
 * #### Parameters
 * @param  {TransferTransaction}   transaction        This component's required {@link TransferTransaction} instance.
 * @param  {Asset}                 asset              The transaction's associated {@link Asset} information.
 * @param  {string}                senderName         The sender account name to be displayed.
 * @param  {string}                recipientName      The recipient account name to be displayed.
 * @param  {boolean}               displayAddresses   The optional flag indicating whether to display account addresses or not.
 */
@Component({})
export default class DappTransferTransaction extends Vue {
  /**
   * This component's required {@link TransferTransaction} instance.
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
   * The transaction's associated {@link Asset} information.
   *
   * @access protected
   * @var {Asset}
   */
  @Prop({
    type: Object,
    required: true,
  })
  protected asset?: Asset;

  /**
   * The sender account name to be displayed.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
    required: true,
  })
  protected senderName?: string;

  /**
   * The recipient account name to be displayed.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
    required: true,
  })
  protected recipientName?: string;

  /**
   * The optional flag indicating whether to display account addresses or not.
   *
   * @access protected
   * @var {boolean}
   */
  @Prop({
    type: Boolean,
    default: true,
  })
  protected displayAddresses?: boolean;

  /**
   * Method to return this component's data object.
   *
   * @access protected
   * @returns {object}
   */
  protected data(): object {
    return {
      contract: "",
      contractType: "",
      amounts: {},
    };
  }

  /**
   * Implementation of this component's `mounted` lifecycle hook.
   * (@see https://vuejs.org/guide/essentials/lifecycle.html)
   *
   * Fetch the current market price of DHP and the amount from transaction.
   *
   * @access protected
   * @async
   * @returns {Promise<void>}}
   */
  protected async mounted(): Promise<void> {
    this.$data.amounts = this.getMosaicAmounts();
  }

  /**
   * Getter to return a boolean indicating whether this component's
   * transaction is a contract transaction or not.
   *
   * Note that this information is obtained by checking the message of the component
   * and see whether it is a valid JSON object, containing the `contract`
   * field.
   *
   * @access protected
   * @returns {boolen}
   */
  protected get hasContract(): boolean {
    if (this.transaction?.message.type !== MessageType.PlainMessage)
      return false;
    try {
      const msgObj = JSON.parse(this.transaction.message.payload);
      if (msgObj.contract) {
        this.$data.contract = msgObj.contract;
        this.$data.contractType = msgObj.contract.split(":")[1];
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  }

  /**
   * Getter to return the sender's address in pretty format.
   * e.g. ABCDEF-GHIJKL-MNOPQR-STUVWX-YZ0123-456789-ABC
   *
   * @access protected
   * @returns {string}
   */
  protected get senderAddress(): string {
    if (!this.transaction || !this.transaction.signer) return "";
    return this.transaction.signer.address.pretty();
  }

  /**
   * Getter to return the recipient's address in pretty format.
   * e.g. ABCDEF-GHIJKL-MNOPQR-STUVWX-YZ0123-456789-ABC
   *
   * @access protected
   * @returns {string}
   */
  protected get recipientAddress(): string {
    if (!this.transaction) return "";
    return (this.transaction.recipientAddress as Address).pretty();
  }

  /**
   * Getter to return the token amount string of this component's transaction.
   * Result is fixed to 2 decimal points (e.g. 100.00).
   *
   * @access protected
   * @returns {string}
   */
  protected get amountToken(): string {
    return this.$data.amounts.token;
  }

  /**
   * Getter to return the fiat equivalent of the token amount of this component's transaction.
   * Result is fixed to 2 decimal points (e.g. 100.00).
   *
   * @access protected
   * @returns {string}
   */
  protected get amountFiat(): string {
    return (this.getPriceToken() * +this.amountToken).toFixed(2);
  }

  /**
   * Method to get the current market price of the associated token.
   * Result is in specified fiat currency and is rounded to 2 decimal places.
   *
   * @access protected
   * @returns {number}
   */
  protected getPriceToken(): number {
    return this.asset ? this.asset.price : 0;
  }

  /**
   * Method to extract mosaic amounts in this component's transaction
   * as an object in format:
   * ```js
   * {
   *  "some-token-id": 100.00,
   *  "39E0C49FA322A459": 10.00
   *  ...
   * }
   * ```
   *
   * @access protected
   * @returns {Record<string, string>}
   */
  protected getMosaicAmounts(): Record<string, string> {
    const amounts: Record<string, string> = {};
    if (this.transaction) {
      for (const mosaic of this.transaction.mosaics) {
        if (mosaic.id.toHex() === this.asset?.mosaicId) {
          amounts.token = (mosaic.amount.compact() / 1e6).toFixed(2);
        } else {
          amounts[mosaic.id.toHex()] = mosaic.amount.toString();
        }
      }
    }
    return amounts;
  }
}
