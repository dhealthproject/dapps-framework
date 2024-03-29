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

// internal dependencies
import { QueryParameters } from "../../../common/concerns/Queryable";
import { StateService } from "../../../common/services/StateService";
import { StateDocument, StateQuery } from "../../../common/models/StateSchema";
import { NetworkService } from "../../../common/services/NetworkService";
import { AccountsService } from "../../../common/services/AccountsService";
import {
  Account,
  AccountDocument,
  AccountModel,
  AccountQuery,
} from "../../../common/models/AccountSchema";
import { DiscoveryCommand, DiscoveryCommandOptions } from "../DiscoveryCommand";
import { TransactionsService } from "../../../discovery/services/TransactionsService";
import { AccountDiscoveryStateData } from "../../models/AccountDiscoveryStateData";
import {
  TransactionDocument,
  TransactionQuery,
} from "../../../common/models/TransactionSchema";
import { LogService } from "../../../common/services/LogService";

/**
 * @class DiscoverAccounts
 * @description The implementation for the accounts discovery
 * scheduler. Contains source code for the execution logic of a
 * command with name: `discovery:DiscoverAccounts`.
 *
 * @since v0.1.0
 */
@Injectable()
export class DiscoverAccounts extends DiscoveryCommand {
  /**
   * Memory store of addresses that have been discovered as recipient
   * of transfer transactions issued from the dApp's main account.
   *
   * @access protected
   * @var {string[]}
   */
  protected discoveredAddresses: string[] = [];

  /**
   * Memory store for the last page number being read. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastPageNumber: number;

  /**
   * Memory store for the last time of execution. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastExecutedAt: number;

  /**
   * Configuration field for the page size to be read. This is used
   * to determine how many transactions are queried per page from
   * the database.
   *
   * @access private
   * @var {number}
   */
  private usePageSize = 100;

  /**
   * Memory store for the last account being read. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {string}
   */
  private lastUsedAccount: string;

  /**
   * The constructor of this class.
   * Params will be automatically injected upon called.
   *
   * @param {LogService}      logger
   * @param {ConfigService}   configService
   * @param {StateService}   statesService
   * @param {NetworkService}  networkService
   * @param {AccountsService} accountsService
   * @param {TransactionsService} transactionsService
   */
  constructor(
    @InjectModel(Account.name) protected readonly model: AccountModel,
    protected readonly logger: LogService,
    protected readonly configService: ConfigService,
    protected readonly statesService: StateService,
    protected readonly networkService: NetworkService,
    protected readonly accountsService: AccountsService,
    protected readonly transactionsService: TransactionsService,
    protected readonly logService: LogService,
  ) {
    // required super call
    super(logService, statesService);

    // sets default state data
    this.lastPageNumber = 1;
    this.lastExecutedAt = new Date().valueOf();
    this.lastUsedAccount = "";
  }

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "name"
   * <br /><br />
   * This property is required through the extension of
   * {@link DiscoveryCommand}.
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
   * <br /><br />
   * This property is required through the extension of
   * {@link DiscoveryCommand}.
   *
   * @see DiscoveryCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get signature(): string {
    return `${this.command} [` + `--source "SOURCE-ADDRESS-OR-PUBKEY"` + `]`;
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
      lastUsedAccount: this.lastUsedAccount,
      lastPageNumber: this.lastPageNumber,
      lastExecutedAt: this.lastExecutedAt,
    } as AccountDiscoveryStateData;
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
   * This scheduler is registered to run **every 2 minutes**.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @param   {string[]}            passedParams
   * @param   {BaseCommandOptions}  options
   * @returns {Promise<void>}
   */
  @Cron("0 */2 * * * *", { name: "discovery:cronjobs:accounts" })
  public async runAsScheduler(): Promise<void> {
    // CAUTION:
    // accounts discovery cronjob uses discovery sources
    const sources = this.configService.get<string[]>("discovery.sources");

    // iterate through all configured discovery sources and
    // fetch assets from db. Accounts will first be read for
    // sources that are *not yet synchronized*.
    const source: string = await this.getNextSource(sources);
    this.lastUsedAccount = source;

    // keep track of last execution
    this.lastExecutedAt = new Date().valueOf();

    // executes the actual command logic (this will call discover())
    await super.run([], {
      source,
      debug: true,
    } as DiscoveryCommandOptions);
  }

  /**
   * This method implements the discovery logic for this command
   * that will find relevant *subjects*. Subjects in this command
   * are **accounts** that have previously *received* a transaction
   * from the dApp's main account.
   * <br /><br />
   * Discovery is done in 2 steps as described below:
   * - Step 1: Reads a batch of 1000 transactions and discover addresses
   * - Step 2: Find or create a corresponding document in `accounts`
   *
   * @access public
   * @async
   * @param   {DiscoveryCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async discover(options?: DiscoveryCommandOptions): Promise<void> {
    // display starting moment information in debug mode
    if (options.debug && !options.quiet) {
      this.debugLog(
        `Starting accounts discovery for source "${options.source}"`,
      );
    }

    // get the latest transactions page number
    if (
      !!this.state &&
      !!this.state.data &&
      "lastPageNumber" in this.state.data
    ) {
      this.lastPageNumber = this.state.data.lastPageNumber ?? 1;
    }

    // per-source synchronization: "discovery:DiscoverTransactions:%SOURCE%"
    const stateIdentifier = `${this.stateIdentifier}:${options.source}`;
    const stateQuerySrc = new StateQuery({
      name: stateIdentifier,
    } as StateDocument);

    // fetch **per-source** synchronization state once
    // Caution: do not confuse with `this.state`, this one
    // is internal and synchronizes **per each source**.
    const state = await this.stateService.findOne(stateQuerySrc);

    const countTransactions =
      !!state && "totalNumberOfTransactions" in state.data
        ? state.data.totalNumberOfTransactions
        : 0;

    // if we reached the end of transactions, we want
    // to continue *only* with recent transactions in
    // the next runs of accounts discovery
    if (
      countTransactions > 0 &&
      this.lastPageNumber * this.usePageSize > countTransactions
    ) {
      this.lastPageNumber =
        Math.floor(countTransactions / this.usePageSize) ?? 1;
    }

    // display debug information about configuration
    if (options.debug && !options.quiet) {
      this.debugLog(
        `Last accounts discovery ended with page: "${this.lastPageNumber}"`,
      );
    }

    // (1) each round queries a page of 100 transactions *from the database*
    // and discovers addresses that are involved in said transactions
    let isSynchronized: boolean;
    for (
      let i = this.lastPageNumber, max = this.lastPageNumber + 10;
      i < max;
      i++, this.lastPageNumber++
    ) {
      // fetches transactions *from the database* (mongo)
      const transactions = await this.transactionsService.find(
        new TransactionQuery(
          {} as TransactionDocument, // queries *any* transaction
          {
            pageNumber: i, // in batches of 100 per page
            pageSize: this.usePageSize,
            sort: "createdAt",
            order: "asc",
          } as QueryParameters,
        ),
      );

      // if we don't get anything, stop querying transactions for now
      if (!transactions.data.length) {
        break;
      }

      // determines the current source's synchronization state
      isSynchronized = transactions.isLastPage();

      // proceeds to extracting accounts from transactions
      this.discoveredAddresses = this.discoveredAddresses
        .concat(
          transactions.data.map((t: TransactionDocument) => t.recipientAddress),
        )
        .filter((v, i, s) => s.indexOf(v) === i); // unique

      // stop and restart at same page if the page was not full
      if (transactions.data.length < this.usePageSize) {
        break;
      }
    }

    if (options.debug && !options.quiet) {
      this.debugLog(
        `Found ${this.discoveredAddresses.length} new accounts from transactions`,
      );
    }

    // bail out if no addresses could be discovered
    if (!this.discoveredAddresses.length) {
      // a per-command state update is *not* necessary here because
      // the `BaseCommand` class' `run` method automatically updates
      // the per-command state with updated values *after* executing
      // this discovery method.

      return; // (void)
    }

    // (2) each round creates or finds 1 `accounts` document
    let nSkipped = 0;
    for (let i = 0, max = this.discoveredAddresses.length; i < max; i++) {
      // retrieve existence information
      const documentExists: boolean = await this.accountsService.exists(
        new AccountQuery({
          address: this.discoveredAddresses[i],
        } as AccountDocument),
      );

      // skip update for known accounts
      if (true === documentExists) {
        nSkipped++;
        continue;
      }

      // store the discovered address in `accounts`
      const referralCode = AccountsService.getRandomReferralCode();
      await this.model.create({
        address: this.discoveredAddresses[i],
        referralCode,
      });
    }

    if (options.debug && !options.quiet) {
      this.debugLog(`Skipped ${nSkipped} account(s) that already exist`);
    }

    // (4) update per-source state `lastPageNumber`
    await this.stateService.updateOne(
      stateQuerySrc, // /!\ per-source
      {
        lastPageNumber: this.lastPageNumber,
        sync: isSynchronized,
      },
    );

    // no-return (void)
  }
}
