/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import {
  Account,
  PublicAccount,
  SignedTransaction,
  Transaction,
} from "@dhealth/sdk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

/**
 * @class SignerService
 * @description Abstraction layer for the creation of digital signatures
 * using dHealth Network Accounts and ellyptic curve cryptography. This
 * class contains methods to *sign* transactions that can be broadcast
 * using nodes from dHealth Network.
 *
 * @since v0.4.0
 */
@Injectable()
export class SignerService {
  /**
   * Contains the *generation hash* used during signature creation. This
   * field is used as an *identifier of the network*.
   * <br /><br />
   * This field is filled from the configuration file `config/network.ts`.
   *
   * @access protected
   * @var {string}
   */
  protected generationHash: string;

  /**
   * Memory store for the *private* account that is used to *sign*
   * transactions with the {@link SignerService.signTransaction} method.
   * <br /><br />
   * This property is *private* and is used in the internal execution
   * handler {@link SignerService.signTransaction}.
   * <br /><br />
   * CAUTION: this instance contains a copy of the *signer* private key
   * and must therefore be handled with care.
   *
   * @access private
   * @var {Account}
   */
  private signerAccount: Account;

  /**
   * Constructs an instance of this service.
   *
   * @access public
   * @constructor
   * @param {ConfigService}   configService
   */
  public constructor(protected readonly configService: ConfigService) {
    // setup base configuration
    this.generationHash = this.configService.get<string>(
      "network.generationHash",
    );

    // setup signing account (issuer)
    this.signerAccount = Account.createFromPrivateKey(
      this.configService.get<string>("payouts.issuerPrivateKey"),
      this.configService.get<number>("network.networkIdentifier"),
    );
  }

  /**
   * Method that executes the creation of a *transaction signature*
   * using `@dhealth/sdk`'s `Account` class.
   * <br /><br />
   * This signature algorithm is currently only compatible with accounts
   * that are *not* multi-signature accounts. A further iteration shall
   * permit the creation of co-signatures as well.
   *
   * @access public
   * @param     {Transaction}   transaction   The prepared transaction that must be signed.
   * @returns   {SignedTransaction}   The created *signed* transaction that was signed using {@link SignerService.signerAccount}.
   */
  public signTransaction(transaction: Transaction): SignedTransaction {
    // uses @dhealth/sdk signature creation
    return this.signerAccount.sign(transaction, this.generationHash);
  }

  /**
   * Method that returns the *public key* of the account that is used
   * to *sign* transactions using this service.
   *
   * @access public
   * @returns   {string}    The public key that corresponds to the account used to *sign* transactions.
   */
  public getSignerPublicKey(): string {
    // forwards to @dhealth/sdk `Account`
    return this.signerAccount.publicKey;
  }

  /**
   * Method that returns the *public account* instance that is used
   * to *sign* transactions using this service.
   *
   * @access public
   * @returns   {PublicAccount}    The public account that corresponds to the account used to *sign* transactions.
   */
  public getSignerPublicAccount(): PublicAccount {
    // forwards to @dhealth/sdk `Account`
    return this.signerAccount.publicAccount;
  }
}
