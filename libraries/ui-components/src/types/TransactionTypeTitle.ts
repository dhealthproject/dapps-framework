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
import { TransactionType } from "@dhealth/sdk";

/**
 * @type TransactionTypeTitleObject
 * @description This type defines a generic structure for a transaction type map object that
 * holds keys of number and values of string.
 *
 * @since v0.1.0
 */
export type TransactionTypeTitleObject = {
  [key: number]: string;
};

/**
 * @const TransactionTypeTitle
 * @description This contant defines a default map of *transaction type title* as in
 * which title an element should display for a specific {@link TransactionType}.
 * <br /><br />
 * This constants serves internally and limit the values to only available {@link TransactionType} values.
 *
 * @since v0.1.0
 */
export const TransactionTypeTitle: TransactionTypeTitleObject = {
  [TransactionType.RESERVED]: "Reserved",
  [TransactionType.TRANSFER]: "Transfer",
  [TransactionType.NAMESPACE_REGISTRATION]: "Namespace Registration",
  [TransactionType.ADDRESS_ALIAS]: "Address Alias",
  [TransactionType.MOSAIC_ALIAS]: "Mosaic Alias",
  [TransactionType.MOSAIC_DEFINITION]: "Mosaic Definition",
  [TransactionType.MOSAIC_SUPPLY_CHANGE]: "Mosaic Supply Change",
  [TransactionType.MULTISIG_ACCOUNT_MODIFICATION]:
    "Multisig Account Modification",
  [TransactionType.AGGREGATE_COMPLETE]: "Aggregate Complete",
  [TransactionType.AGGREGATE_BONDED]: "Aggregate Bonded",
  [TransactionType.HASH_LOCK]: "Hash Lock",
  [TransactionType.SECRET_LOCK]: "Secret Lock",
  [TransactionType.SECRET_PROOF]: "Secret Proof",
  [TransactionType.ACCOUNT_ADDRESS_RESTRICTION]: "Account Address Restriction",
  [TransactionType.ACCOUNT_MOSAIC_RESTRICTION]: "Account Mosaic Restriction",
  [TransactionType.ACCOUNT_OPERATION_RESTRICTION]:
    "Account Operation Restriction",
  [TransactionType.ACCOUNT_KEY_LINK]: "Account Key Link",
  [TransactionType.MOSAIC_ADDRESS_RESTRICTION]: "Mosaic Address Restriction",
  [TransactionType.MOSAIC_GLOBAL_RESTRICTION]: "Mosaic Global Restriction",
  [TransactionType.ACCOUNT_METADATA]: "Account Metadata",
  [TransactionType.MOSAIC_METADATA]: "Mosaic Metadata",
  [TransactionType.NAMESPACE_METADATA]: "Namespace Metadata",
  [TransactionType.VRF_KEY_LINK]: "VRF Key Link",
  [TransactionType.VOTING_KEY_LINK]: "Voting Key Link",
  [TransactionType.NODE_KEY_LINK]: "Node Key Link",
};
