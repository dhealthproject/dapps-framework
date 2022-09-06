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
  Address,
  MessageType,
  Mosaic,
  TransferTransaction,
} from "@dhealth/sdk";
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";

// internal dependencies
import { Asset } from "@/types/Asset";

/**
 * @class DappContractOperation
 * @description This component displays a graphic presentation
 * of a {@link TransferTransaction} instance, with different
 * adjustments for each contract type if the transaction is a
 * contract transaction, otherwise displays amount details.
 * <br /><br />
 * You can customize the look&feel of this components with adjusting the props.
 * <br /><br />
 * @example Using the DappIcon component with sizes
 * Sizes that are available with the components library
 * can take up values as defined in {@link Size}.
 * <br /><br />
 * ```html
 *  <template>
 *    <DappContractOperation
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
export default class DappContractOperation extends Vue {
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
    required: false,
    default: () => ({
      mosaicId: "39E0C49FA322A459",
      label: "DHP",
      priceInformation: {
        priceCurrency: "USD",
        price: 0.01,
      },
      inputDecimals: 6,
      outputDecimals: 2,
    }),
  })
  protected asset!: Asset;

  /**
   * The sender account name to be displayed.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
    required: false,
    default: "Unknown sender",
  })
  protected senderName!: string;

  /**
   * The recipient account name to be displayed.
   *
   * @access protected
   * @var {string}
   */
  @Prop({
    type: String,
    required: false,
    default: "Unknown recipient",
  })
  protected recipientName!: string;

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
   * The contract object extracted from the message of this component's transaction.
   *
   * @access protected
   * @var {Record<string, string>}
   */
  @PropSync("_contract", {
    type: Object,
  })
  protected contract?: Record<string, string>;

  /**
   * The contract type extracted from the message of this component's transaction.
   *
   * @access protected
   * @var {Record<string, string>}
   */
  @PropSync("_contractType", {
    type: String,
  })
  protected contractType?: string;

  /**
   * The amounts object extracted from the message of this component's transaction.
   *  <br /><br />
   * Note that this prop has the following format:
   * ```js
   * {
   *  token: 100.00, // the specified token in `asset` prop
   *  "39E0C49FA322A459": 1000000, // some other token from the transaction
   *  ...
   * }
   * ```
   * <br /><br />
   *
   * @access protected
   * @var {Record<string, string>}
   */
  @PropSync("_amounts", {
    type: Object,
  })
  protected amounts?: Record<string, string>;

  /**
   * Implementation of this component's `mounted` lifecycle hook.
   * (@see https://vuejs.org/guide/essentials/lifecycle.html)
   *
   * Get the mosaic amount and message content (if plain) from the transaction.
   *
   * @access protected
   * @async
   * @returns {void}}
   */
  protected mounted(): void {
    this.amounts = this.getMosaicAmounts();
    if (
      this.transaction &&
      this.transaction?.message.type === MessageType.PlainMessage
    ) {
      try {
        const msgObj = JSON.parse(this.transaction.message.payload);
        if (msgObj.contract) {
          this.contract = msgObj.contract;
          this.contractType = msgObj.contract.split(":")[1];
        }
      } catch (e) {
        return;
      }
    }
  }

  /**
   * Getter to return a boolean indicating whether this component's
   * transaction is a contract transaction or not.
   *
   * Note that this information is obtained by checking the message of the component
   * and see whether it is a valid JSON object, containing the `contract` field.
   *
   * @access protected
   * @returns {boolen}
   */
  protected get hasContract(): boolean {
    return !!this.contract;
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
    if (!this.amounts) return "0";
    return this.amounts.token;
  }

  /**
   * Getter to return the fiat equivalent of the token amount of this component's transaction.
   * Result is fixed to 2 decimal points (e.g. 100.00).
   *
   * @access protected
   * @returns {string}
   */
  protected get amountFiat(): string {
    const decimalPoints = this.asset?.outputDecimals
      ? this.asset?.outputDecimals
      : 2;
    return (this.getTokenPrice() * +this.amountToken).toFixed(decimalPoints);
  }

  /**
   * Method to get the current market price of the associated token.
   * Result is in specified fiat currency and is rounded to 2 decimal places.
   *
   * @access protected
   * @returns {number}
   */
  protected getTokenPrice(): number {
    if (this.asset && this.asset.priceInformation) {
      return this.asset.priceInformation.price;
    }
    return 0;
  }

  /**
   * Method to extract mosaic amount from this component's transaction
   * as an object with following format:
   * ```js
   * {
   *  token: 100.00,
   *  "39E0C49FA322A459": 1000000,
   *  ...
   * }
   * ```
   *
   * @access protected
   * @returns {Record<string, string>}
   */
  protected getMosaicAmounts(): Record<string, string> {
    const amounts: Record<string, string> = {};
    this.transaction?.mosaics.forEach((mosaic: Mosaic) => {
      if (mosaic.id.toHex() === this.asset?.mosaicId) {
        const inputDecimals = this.asset.inputDecimals
          ? this.asset.inputDecimals
          : 6;
        const outputDecimals = this.asset.outputDecimals
          ? this.asset.outputDecimals
          : 2;
        amounts.token = (
          mosaic.amount.compact() / Math.pow(10, inputDecimals)
        ).toFixed(outputDecimals);
      } else {
        amounts[mosaic.id.toHex()] = mosaic.amount.toString();
      }
    });
    return amounts;
  }
}
