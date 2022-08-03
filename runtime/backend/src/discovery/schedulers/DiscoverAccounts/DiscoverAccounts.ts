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
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import {
  AggregateTransactionInfo,
  PublicAccount,
  Transaction as SdkTransaction,
  TransactionInfo,
  NetworkType,
} from "@dhealth/sdk";

// internal dependencies
import { StateService } from "../../../common/services/StateService";
import { NetworkService } from "../../../common/services/NetworkService";
import { DiscoveryCommand, DiscoveryCommandOptions } from "../DiscoveryCommand";
import { AccountsService } from "../../services/AccountsService";
import { TransactionsService } from "../../../discovery/services/TransactionsService";
import { Account, AccountModel, AccountQuery } from "../../models/AccountSchema";
import { AccountDiscoveryStateData } from "../../models/AccountDiscoveryStateData";
import { Transaction, TransactionQuery } from "../../models/TransactionSchema";

/**
 * @class DiscoverAccounts
 * @description The private implementation for the scheduler as
 * defined in {@link DiscoverAccountsCommand}. Contains source
 * code for the execution logic of a cronjob with identifier:
 * `accountsDiscovery`.
 *
 * @since v0.1.0
 */
@Injectable()
export class DiscoverAccounts
  extends DiscoveryCommand
{
  /**
   * Memory store of addresses that have been discovered as recipient
   * of transfer transactions issued from the dApp's main account.
   *
   * @access protected
   * @var {string[]}
   */
  protected discoveredAddresses: string[] = [];

  /**
   * The constructor of this class.
   * Params will be automatically injected upon called.
   *
   * @param {ConfigService}   configService
   * @param {StateService}   statesService
   * @param {NetworkService}  networkService
   * @param {AccountsService} accountsService
   */
  constructor(
    @InjectModel(Account.name) protected readonly model: AccountModel,
    protected readonly configService: ConfigService,
    protected readonly statesService: StateService,
    protected readonly networkService: NetworkService,
    protected readonly accountsService: AccountsService,
    protected readonly transactionsService: TransactionsService,
  ) {
    // required super call
    super(statesService);
  }

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "scope:name"
   *
   * @see DiscoveryCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get command(): string {
    return `DiscoverAccounts`;
  }

  /**
   * This method must return a *command signature* that
   * contains hints on the command name and its required 
   * and optional arguments.
   * <br /><br />
   * e.g. "command <argument> [--option value]"
   *
   * @see DiscoveryCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get signature(): string {
    return `${this.command} [--source "SOURCE-ADDRESS-OR-PUBKEY"]`;
  }

  /**
   * This helper method should return the latest execution state
   * such that it can be saved.
   * <br /><br />
   * Execution states refer to one module's required state data,
   * potentially necessary during execution, and which is fetched
   * in {@link run} before execution and updated in {@link run}
   * after execution.
   *
   * @access protected
   * @returns {StateData}
   */
  protected getStateData(): AccountDiscoveryStateData {
    return {
      lastExecutedAt: new Date().valueOf(),
    } as AccountDiscoveryStateData
  }

  /**
   * This method is the **entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * of the `CommandRunner` interface in {@link BaseCommand},
   * the nest backend runtime is able to discover this when the
   * `discovery` scope is enabled.
   * <br /><br />
   * This method is necessary to make sure this command is run
   * with the correct `--source` option.
   * <br /><br />
   * This scheduler is registered to run **every 5 minutes**.
   *
   * @todo This discovery should use a specific **discovery** config field instead of dappPublicKey
   * @see BaseCommand
   * @access public
   * @async
   * @param   {string[]}            passedParams  
   * @param   {BaseCommandOptions}  options 
   * @returns {Promise<void>}
   */
  @Cron("0 */5 * * * *", { name: "discovery:cronjobs:accounts" })
  public async runAsScheduler(): Promise<void> {
    // accounts discovery cronjob always read the dApp's main account
    const dappPubKey  = this.configService.get<string>("dappPublicKey");
    const networkType = this.configService.get<NetworkType>("network.networkIdentifier");

    // creates the discovery source public account
    const publicAcct  = PublicAccount.createFromPublicKey(dappPubKey, networkType);

    // executes the actual command logic (this will call discover())
    await super.run([], {
      source: publicAcct.address.plain(),
      debug: true,
    } as DiscoveryCommandOptions);
  }

 /**
   * This method implements the discovery logic for this command
   * that will find relevant *subjects*. Subjects in this command
   * are **accounts** that have previously *received* a transaction
   * from the dApp's main account.
   * <br /><br />
   * Discovery is done in 3 steps as described below:
   * - Step 1: Reads the dApp's main account outgoing transactions
   * - Step 2: Updates accounts' transaction time if necessary
   * - Step 3: Updates the accounts documents in a batch operation
   *
   * @access public
   * @async
   * @param   {DiscoveryCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async discover(options?: DiscoveryCommandOptions): Promise<void> {
    // display starting moment information in debug mode
    if (options.debug && !options.quiet) {
      this.debugLog(`Starting accounts discovery for source "${options.source}"`);
    }

    // fetches transactions *from the database* (mongo)
    const transactions = await this.transactionsService.find(new TransactionQuery(
      {} as Transaction, // query *all* transactions
    ));

    // proceeds to extracting accounts from transactions
    this.discoveredAddresses = this.discoveredAddresses.concat(
      transactions.data.map(t => t.signerAddress),
    ).filter((v, i, s) => s.indexOf(v) === i); // unique

    // (2) each discovered address is cached in our `accounts`
    // collection and may require the creation of a document
    let uniqueAddresses: string[] = this.discoveredAddresses.filter(
      async (address: string) => undefined === await this.accountsService.findOne(
        new AccountQuery({ address } as Account)
      )
    );

    if (options.debug && !options.quiet) {
      this.debugLog(`Found ${uniqueAddresses.length} new accounts from transactions`);
    }

    // (3) each round creates or finds 1 `accounts` document
    const documents: Account[] = [];
    for (let i = 0, max = uniqueAddresses.length; i < max; i++) {
      documents.push(this.model.create({
        address: uniqueAddresses[i],
      }));
    }

    // (4) commits documents to database collection `accounts`
    if (documents.length > 0) {
      // display debug information about database operation
      if (options.debug && !options.quiet) {
        this.debugLog(`Creating ${documents.length} accounts documents in database`);
      }

      this.accountsService.updateBatch(documents);
    }
  }
}
