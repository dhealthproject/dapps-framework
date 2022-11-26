/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend Configuration
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @label CONFIG
 * @module PayoutConfig
 * @description The dApp payouts configuration. This configuration
 * object is used to determine how payouts are created for this
 * dApp and determines the source configuration.
 * <br /><br />
 * A payout configuration object consists of:
 * - An *issuer* private key. This private key corresponds to an
 * Account in dHealth Network that will be *creating* transactions
 * and potentially request other co-signers approval. The account
 * that corresponds to this private key *must* always own a certain
 * amount of the `dhealth.dhp` mosaic so that it can pay for *fees*
 * on the network.
 * - A *signer* public key. This public key corresponds to an Account
 * in dHealth Network that will be considered the *signer* of transactions.
 * We make a distinction here as to permit governance schemes that include
 * multi-signature accounts for the payout scope, as such it is possible
 * that the *issuer* and *signer* accounts are different. In those cases,
 * the *issuer account* only needs enough `dhealth.dhp` to create SPAM-fee
 * transactions, whereas the *signer account* will be executing the actual
 * payouts (transfer transactions).
 * <br /><br />
 * CAUTION: By modifying the content of this configuration field,
 * *changes* may occur for the dHealth Network connection and may
 * thereby affect the data loaded by the backend runtime.
 *
 * @since v0.4.0
 */
export default () => ({
  /**
   * Flag that is used to enable a **global dry-run** mode for the payout
   * scope. This mode *disables* the broadcast of transactions using nodes
   * from dHealth Network.
   * <br /><br />
   * Note that by setting this option to `true`, the runtime **will not**
   * anymore broadcast *any* transaction to nodes from dHealth Network.
   *
   * @example `false`
   * @var {boolean}
   */
  globalDryRun: process.env.PAYOUT_GLOBAL_DRY_RUN === "true",

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
   * @example `{ issuerPrivateKey: "", signerPublicKey: "" }`
   * @var {PayoutAccountsConfig}
   */
  payouts: {
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
     * @var {string}
     */
    issuerPrivateKey: process.env.PAYOUT_ISSUER_PRIVATE_KEY,

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
     * @var {string}
     */
    signerPublicKey: process.env.PAYOUT_CONTRACT_PUBLIC_KEY,

    /**
     * 
     */
    enableBatches: false,

    /**
     * 
     */
    batchSize: 100,
  }
});
