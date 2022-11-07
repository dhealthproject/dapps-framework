/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { TransactionDocument } from "../../common/models/TransactionSchema";

/**
 * @label COMMON
 * @type OperationParameters
 * @description This type consists of operation parameters that are
 * necessary when processing high-level information from data that
 * is communicated using dHealth Network Transactions. The `query`
 * field is passed as a *mongo filter query* for relevant subjects.
 * <br /><br />
 * @example Example operation configuration object
 * ```json
 * {
 *   contract: "elevate:auth"
 *   label: "Session|Sessions",
 *   query: {
 *     sourceAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"
 *   }
 * }
 * ```
 *
 * @link ProcessorConfig:COMMON
 * @since v0.3.0
 */
export type OperationParameters = {
  contract: string;
  label: string;
  query: TransactionDocument | any;
};

/**
 * @label COMMON
 * @interface ProcessorConfig
 * @description The dApp network configuration. This configuration
 * object is used to determine how information is processed into
 * *operations* for this dApp.
 *
 * @link ProcessorConfig:CONFIG
 * @since v0.2.0
 */
export interface ProcessorConfig {
  /**
   * A list of enable *contracts*. Note that this configuration
   * field accepts a *contract identifier* which does not include
   * the dApp identifier.
   * <br /><br />
   * Note that *operations* are only processed given the presence
   * of the *contract* in this configuration field, i.e. if your
   * dApp must process authentication operations, make sure to add
   * the `"auth"` contract in this configuration field.
   * <br /><br />
   * CAUTION: By removing an entry of this configuration field,
   * *changes* will occur to the list of recent operations that
   * have been processed and thereby affect the data loaded by
   * the backend runtime.
   *
   * @example `["auth", "earn"]`
   * @access public
   * @var {string[]}
   */
  contracts: string[];

  /**
   * An operations configuration object. This consists of an array of
   * {@link OperationParameters} which are used to *process* subjects
   * according to custom transaction queries, i.e. elevate defines an
   * authentication contract whereby the discovery source is always a
   * singular account, this is one query parameter that is used.
   * <br /><br />
   * CAUTION: By modifying the content of this configuration field,
   * *changes* may occur for the Operations that a dApp processes
   * and may thereby affect the data loaded by the backend runtime.
   * <br /><br />
   * @example Example operation configuration object
   * ```json
   * {
   *   contract: "elevate:auth"
   *   label: "Session|Sessions",
   *   query: {
   *     sourceAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"
   *   }
   * }
   * ```
   *
   * @access public
   * @var {OperationParameters[]}
   */
  operations: OperationParameters[];
}
