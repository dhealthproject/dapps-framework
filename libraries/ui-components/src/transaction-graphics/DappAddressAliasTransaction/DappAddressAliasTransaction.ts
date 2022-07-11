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
  AddressAliasTransaction,
  AliasAction,
  TransactionType,
} from "@dhealth/sdk";

// internal dependencies
import DappGraphicComponent from "@/graphics/DappGraphicComponent/DappGraphicComponent";
import DappAccountAvatar from "@/graphics/DappAccountAvatar/DappAccountAvatar.vue";
import DappNamespaceCircle from "@/graphics/DappNamespaceCircle/DappNamespaceCircle.vue";
import DappNamespaceUnlinkCircle from "@/graphics/DappNamespaceUnlinkCircle/DappNamespaceUnlinkCircle.vue";
import DappTransactionArrow from "@/graphics/DappTransactionArrow/DappTransactionArrow.vue";

/**
 * @class DappAddressAliasTransaction
 * @description This component display a transaction graphic that represents
 * a {@link AddressAliasTransaction} instance.
 * <br /><br />
 * You can customize this component using custom HTML
 * attributes [as listed below](#parameters).
 * <br /><br />
 * @example Using the DappAddressAliasTransaction component
 * ```html
 *   <template>
 *     <DappAddressAliasTransaction
 *      :transaction="some-AddressAliasTransaction-instance"
 *     />
 *   </template>
 * ```
 *
 * <br /><br />
 * #### Parameters
 *
 * @param  {AddressAliasTransaction}    transaction         The {@link AddressAliasTransaction} instance to be displayed.
 *
 * @since v0.1.0
 */
@Component({
  components: {
    DappAccountAvatar,
    DappNamespaceCircle,
    DappNamespaceUnlinkCircle,
    DappTransactionArrow,
  },
})
export default class DappAddressAliasTransaction extends DappGraphicComponent {
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
  protected transaction?: AddressAliasTransaction;

  /**
   * Method to return this component's data.
   *
   * @access protected
   * @returns {object}
   */
  protected data(): object {
    return {
      width: this.transactionGraphicWidth,
      heigth: this.transactionGraphicHeight,
    };
  }

  /**
   * Getter to return this component's transaction type caption.
   *
   * @access protected
   * @return {string}
   */
  protected get transactionType(): string {
    return this.getTransactionTypeCaption(TransactionType.ADDRESS_ALIAS);
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
   * Getter to return whether component's transaction is a "Link" alias transaction.
   *
   * @access protected
   * @return {boolean}
   */
  protected get isLinkAction(): boolean {
    if (!this.transaction) return false;
    return AliasAction[this.transaction?.aliasAction] === "Link";
  }

  /**
   * Getter to return this component's subtitle.
   * This is displayed below the graphic and next to the transaction type string.
   *
   * @access protected
   * @returns {string}
   */
  protected get subTitle(): string {
    if (!this.transaction) return "";
    return `. ${AliasAction[this.transaction?.aliasAction]} namespace`;
  }

  /**
   * Getter to return this component's transaction namespace details.
   *
   * @access protected
   * @returns {{namespaceId: string, namespaceName: string}}
   */
  protected get namespace(): object {
    return {
      namespaceId: this.transaction?.namespaceId.id.toHex(),
      namespaceName: this.transaction?.namespaceId.fullName,
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

  /**
   * Getter to return this component's transaction address field.
   *
   * @access protected
   * @returns {string}
   */
  protected get address(): string {
    if (!this.transaction || !this.transaction.address) return "undefined";
    return this.transaction?.address.plain();
  }
}
