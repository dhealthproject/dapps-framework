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
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Address, NetworkType, PublicAccount } from "@dhealth/sdk";

// internal dependencies
import { PaginatedResultDTO } from "../models/PaginatedResultDTO";
import { QueryService } from "../services/QueryService";
import { AuthenticationPayload } from "./AuthService";
import {
  Account,
  AccountDocument,
  AccountModel,
  AccountQuery,
} from "../models/AccountSchema";
import { EventEmitter2 } from "@nestjs/event-emitter";

// configuration resources
import { DappConfig, NetworkConfig } from "../models";
import { AppConfiguration } from "../../AppConfiguration";

/**
 * @class AccountsService
 * @description The main service to handle documents in the
 * `accounts` collection.
 *
 * @since v0.1.0
 */
@Injectable()
export class AccountsService {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {AccountModel} model
   * @param {QueriesService} queriesService
   */
  constructor(
    @InjectModel(Account.name) private readonly model: AccountModel,
    private readonly queriesService: QueryService<
      AccountDocument,
      AccountModel
    >,
    private readonly emitter: EventEmitter2,
  ) {}

  /**
   * This method executes a *count* query using the {@link model}
   * argument.
   * <br /><br />
   * Caution: Count queries require a considerable amount of RAM
   * to execute. It is preferred to use pro-active statistics with
   * collections that contain one document with a counter.
   *
   * @param   {AccountQuery}  query
   * @returns {Promise<number>}   The number of matching accounts.
   */
  async count(query: AccountQuery): Promise<number> {
    return await this.queriesService.count(query, this.model);
  }

  /**
   * Method to query the *existence* of a document in the
   * `accounts` collection.
   * <br /><br />
   * This executes a *lean* mongoose query such that the
   * properties of the returned document are *reduced* to
   * only the `"_id"` field.
   *
   * @param   {AccountQuery}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  public async exists(query: AccountQuery): Promise<boolean> {
    // executes a *lean* mongoose findOne query
    const document: AccountDocument = await this.queriesService.findOne(
      query,
      this.model,
      true, // stripDocument ("lean query")
    );

    // https://simplernerd.com/typescript-convert-bool/
    return !!document;
  }

  /**
   * Method to query accounts based on query and returns as paginated result.
   *
   * @async
   * @param   {AccountQuery} query
   * @returns {Promise<PaginatedResultDTO<AccountDocument>>}
   */
  public async find(
    query: AccountQuery,
  ): Promise<PaginatedResultDTO<AccountDocument>> {
    return await this.queriesService.find(query, this.model);
  }

  /**
   * Find one `AccountDocument` instance in the database and use
   * a query based on the {@link Queryable} class.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {AccountQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<AccountDocument>}  The resulting `accounts` document.
   */
  public async findOne(query: AccountQuery): Promise<AccountDocument> {
    return await this.queriesService.findOne(query, this.model);
  }

  /**
   * This method updates *exactly one document* in a collection.
   * <br /><br />
   *
   * @async
   * @param   {AccountQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {AccountModel}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<AccountDocument>}  The *updated* `accounts` document.
   */
  public async createOrUpdate(
    query: AccountQuery,
    data: AccountModel,
    ops: Record<string, any> = {},
  ): Promise<AccountDocument> {
    return await this.queriesService.createOrUpdate(
      query,
      this.model,
      data,
      ops,
    );
  }

  /**
   * This method creates an `accounts` document for the authentication
   * process. It is used internally to make sure an account always exists
   * after an authentication challenge was successfully validated on-chain.
   * <br /><br />
   * Note that this method must be used *only* when the authentication payload
   * has been validated and created, i.e. in {@link AuthService.validateChallenge}.
   *
   * @access public
   * @async
   * @param   {AuthenticationPayload}   payload         The *authorized* authentication payload.
   * @returns {Promise<AccountDocument>}  The corresponding `accounts` document.
   */
  public async getOrCreateForAuth(
    payload: AuthenticationPayload,
  ): Promise<AccountDocument> {
    // shortcut
    const accountQuery = new AccountQuery({
      address: payload.address,
    } as AccountDocument);

    // retrieve existence information
    const accountExists: boolean = await this.exists(accountQuery);

    if (accountExists === true) {
      // fetch if already exists
      return await this.findOne(accountQuery);
    }

    // determine the referrer account if any
    let referredBy: string | undefined = undefined;
    if (payload.referralCode && payload.referralCode.length) {
      const referrer = await this.findOne(
        new AccountQuery({
          referralCode: payload.referralCode,
        } as AccountDocument),
      );

      referredBy = referrer.address;
    }

    // create a random referral code
    const referralCode = AccountsService.getRandomReferralCode();

    // create notification for newly created user
    this.emitter.emit("notifier.users.notify", {
      address: payload.address,
      subjectType: "general",
      title: "Welcome to Elevate!",
      description:
        "Welcome to Elevate! Please, integrate your account with provider.",
      shortDescription: "Thanks for joining!",
    });

    // store the authenticated address in `accounts`
    return await this.createOrUpdate(accountQuery, {
      referralCode,
      referredBy,
    });
  }

  /**
   * Method to update a batch of accounts.
   *
   * @async
   * @param   {AccountModel[]} accountDocuments
   * @returns {Promise<number>}
   */
  public async updateBatch(accountDocuments: AccountModel[]): Promise<number> {
    return await this.queriesService.updateBatch(this.model, accountDocuments);
  }

  /**
   * Static API
   */
  /**
   * This helper method serves as a *parser* for account
   * public keys and addresses.
   * <br /><br />
   * This *static* method can be used for any inputs that
   * require to *identify* a participant [account]. Accounts
   * can always be referred to by their public key as it can
   * be used to generate the resulting identifier (address).
   *
   * @param     {string}  publicKeyOrAddress     Must contain one of an account public key or an account address.
   * @returns   {Address}   A parsed dHealth Account Address
   */
  public static createAddress(publicKeyOrAddress: string): Address {
    // extracts the network type from configuration
    const { networkIdentifier } = (
      AppConfiguration.getConfig("network") as NetworkConfig
    ).network;
    const networkType = networkIdentifier as NetworkType;

    // if we have a public key (64 characters in hexadecimal format)
    if (publicKeyOrAddress.length === 64) {
      // use PublicAccount from @dhealth/sdk using public key
      const publicAccount = PublicAccount.createFromPublicKey(
        publicKeyOrAddress,
        networkType,
      );

      // public-key to address
      return publicAccount.address;
    }

    // otherwise *assume* we have an address (and remove hyphens/spaces if any)
    const sourceAddress: string = publicKeyOrAddress.replace(/[\- ]/g, "");

    // source input is **not** a valid address, return fallback
    if (sourceAddress.length !== 39) {
      return AccountsService.createAddress(
        (AppConfiguration.getConfig("dapp") as DappConfig).dappPublicKey,
      );
    }

    // source input **is a valid address format**
    return Address.createFromRawAddress(sourceAddress);
  }

  /**
   * This public helper generates a random referral code for new
   * users and can be used when creating new `accounts` documents.
   *
   * @static
   * @access public
   * @returns {string}
   */
  public static getRandomReferralCode(): string {
    return `JOINFIT-${Math.random().toString(36).slice(-8)}`;
  }
}
