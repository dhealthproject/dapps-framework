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
  MosaicAliasTransaction,
  AliasAction,
  TransactionType,
} from "@dhealth/sdk";

// internal dependencies
import DappGraphicComponent from "@/graphics/DappGraphicComponent/DappGraphicComponent";
import DappAccountAvatar from "@/graphics/DappAccountAvatar/DappAccountAvatar.vue";
import DappNamespaceCircle from "@/graphics/DappNamespaceCircle/DappNamespaceCircle.vue";
import DappNamespaceUnlinkCircle from "@/graphics/DappNamespaceUnlinkCircle/DappNamespaceUnlinkCircle.vue";
import DappTransactionArrow from "@/graphics/DappTransactionArrow/DappTransactionArrow.vue";
import DappMosaicIcon from "@/graphics/DappMosaicIcon/DappMosaicIcon.vue";

@Component({
  components: {
    DappAccountAvatar,
    DappNamespaceCircle,
    DappNamespaceUnlinkCircle,
    DappTransactionArrow,
    DappMosaicIcon,
  },
})
export default class DappMosaicAliasTransaction extends DappGraphicComponent {
  /**
   * The {@link MosaicAliasTransaction} instance to be displayed.
   *
   * @access protected
   * @var {MosaicAliasTransaction}
   */
  @Prop({
    type: Object,
    required: true,
  })
  protected transaction?: MosaicAliasTransaction;

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
    return this.getTransactionTypeCaption(TransactionType.MOSAIC_ALIAS);
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
   * Getter to return this component's mosaic object.
   *
   * @access protected
   * @returns {object}
   */
  protected get mosaic(): object {
    return { mosaicId: this.transaction?.mosaicId.toHex() };
  }
}
