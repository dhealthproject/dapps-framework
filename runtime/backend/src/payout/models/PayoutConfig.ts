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
import { PayoutLimitDTO } from "./PayoutLimitDTO";

/**
 * @label COMMON
 * @interface PayoutAccountsConfig
 * @description The dApp payout accounts configuration.
 *
 * @link PayoutConfig
 * @since v0.4.0
 */
export interface PayoutAccountsConfig {
  /**
   * A private key that is used to prepare payouts (*sign*). This
   * account private key *must* correspond to the signer account
   * or it *must* be a co-signer of the signer account on dHealth
   * Network.
   * <br /><br />
   * Note that modifying this private key *will* affect the payouts
   * that are executed by this backend runtime in that it will send
   * these transactions from a *different account*.
   * <br /><br />
   * Whenever this field is modified, it is important that a discovery
   * source is registered in the configuration for the linked account
   * address, in `config/dapp.ts` under `discovery.sources`.
   *
   * @example `"71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE"`
   * @access public
   * @var {string}
   */
  issuerPrivateKey: string;

  /**
   * A public key that is used to announce payouts on the network. This
   * account public key *must* correspond to the Account on dHealth Network
   * that will be executing the *transfer transaction.
   * <br /><br />
   * Note that this field may *possibly* refer to a different account than
   * the above {@link issuerPrivateKey}. In those cases, the issuer account
   * is used to initially create the transaction, and the signer account is
   * used to broadcast and confirm the transaction (after co-signatures).
   *
   * @example `"71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE"`
   * @access public
   * @var {string}
   */
  signerPublicKey: string;

  /**
   * Value indicating whether to proceed payouts in batches or not.
   *
   * @example `true`
   * @access public
   * @var {boolean}
   */
  enableBatches: boolean;

  /**
   * Value indicating the payout batch size.
   *
   * @example `100`
   * @access public
   * @var {number}
   */
  batchSize: number;

  /**
   * The daily limit for each type of payouts.
   *
   * @example `{ activities: 100, boosters: 100 }`
   * @access public
   * @var {PayoutsLimitDTO}
   */
  limit: PayoutLimitDTO;
}

/**
 * @label COMMON
 * @interface PayoutConfig
 * @description The dApp payouts configuration. This configuration
 * object is used to determine how payouts are created for this
 * dApp and determines the source configuration.
 *
 * @link PayoutConfig
 * @since v0.4.0
 */
export interface PayoutConfig {
  /**
   * Flag that is used to enable a **global dry-run** mode for the payout
   * scope. This mode *disables* the broadcast of transactions using nodes
   * from dHealth Network.
   * <br /><br />
   * Note that by setting this option to `true`, the runtime **will not**
   * anymore broadcast *any* transaction to nodes from dHealth Network.
   *
   * @access public
   * @example `false`
   * @var {boolean}
   */
  globalDryRun: boolean;

  /**
   * Configuration object for the payouts scope. This configuration
   * object is used to determine how payouts are created for this
   * dApp and determines the source configuration.
   * <br /><br />
   * Following concepts apply with the below configuration fields:
   * - An **issuer account** creates transactions and [initially] signs
   * them (i.e. the creator) ; and
   * - A **signer account** collects transaction signatures and is used
   * to broadcast the transaction (i.e. the sender).
   *
   * @access public
   * @example `{ issuerPrivateKey: "", signerPublicKey: "" }`
   * @var {PayoutAccountsConfig}
   */
  payouts: PayoutAccountsConfig;
}
