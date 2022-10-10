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
import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Cron } from "@nestjs/schedule";
import { Contract } from "@dhealth/contracts";

// internal dependencies
import { QueryParameters } from "../../../common/concerns/Queryable";
import { PaginatedResultDTO } from "../../../common/models/PaginatedResultDTO";
import { StateService } from "../../../common/services/StateService";
import { NetworkService } from "../../../common/services/NetworkService";
import { StateDocument, StateQuery } from "../../../common/models/StateSchema";
import { ProcessorCommand, ProcessorCommandOptions } from "../ProcessorCommand";
import { OperationsService } from "../../services/OperationsService";
import { getOperation } from "../../models/OperationTypes";
import {
  Operation,
  OperationDocument,
  OperationModel,
  OperationQuery,
} from "../../models/OperationSchema";
import { OperationProcessorStateData } from "../../models/OperationProcessorStateData";
import { OperationParameters } from "../../models/ProcessorConfig";
import {
  Transaction,
  TransactionDocument,
  TransactionModel,
  TransactionQuery,
} from "../../../common/models/TransactionSchema";
import { QueryService } from "../../../common/services/QueryService";

/**
 * @interface ProcessOperationsCommandOptions
 * @description This interface defines **arguments** that can be
 * passed to this **discovery** command that is implemented in the
 * backend runtime.
 * <br /><br />
 * Note that it is important that child classes extend this interface
 * with their own specification of arguments.
 *
 * @see ProcessorCommandOptions
 * @since v0.3.0
 */
export interface ProcessOperationsCommandOptions
  extends ProcessorCommandOptions {
  /**
   * Defines the contract's operation, or "how does data get processed" for
   * this specific contract.
   *
   * @access public
   * @var {OperationParameters}
   */
  operation: OperationParameters;
}

/**
 * @class ProcessOperations
 * @description The implementation for the operations processor
 * scheduler. Contains source code for the execution logic of a
 * command with name: `processor:ProcessOperations`.
 *
 * @since v0.3.0
 */
@Injectable()
export class ProcessOperations extends ProcessorCommand {
  /**
   * Memory store for *all* transactions processed in one run of this
   * command. Note that it contains **only transfer** transactions as
   * those are the only relevant to this processor command.
   *
   * @access protected
   * @var {TransactionDocument[]}
   */
  protected transactions: TransactionDocument[] = [];

  /**
   * Memory store for *all* contracts processed in one run of this
   * command. As is usual, one contract is always execute with one
   * transaction [hash].
   *
   * @access protected
   * @var {Record<string, Contract>}
   */
  protected contractsByHash: Record<string, Contract> = {};

  /**
   * Memory store for the total number of operations. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private totalNumberOfOperations: number;

  /**
   * Memory store for the last page number being read. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastPageNumber: number;

  /**
   * Constructs and prepares an instance of this scheduler.
   *
   * @param {ConfigService}   configService
   * @param {StateService}   stateService
   * @param {NetworkService}  networkService
   * @param {TransactionsService}  transactionsService
   * @param {OperationsService}  operationsService
   */
  constructor(
    @InjectModel(Operation.name) protected readonly model: OperationModel,
    @InjectModel(Transaction.name)
    protected readonly transactionModel: TransactionModel,
    protected readonly configService: ConfigService,
    protected readonly stateService: StateService,
    protected readonly networkService: NetworkService,
    protected readonly queriesService: QueryService<
      TransactionDocument,
      TransactionModel
    >,
    protected readonly operationsService: OperationsService,
  ) {
    // required super call
    super(stateService);

    // sets default state data
    this.lastPageNumber = 1;
    this.totalNumberOfOperations = 0;
  }

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "scope:name"
   * <br /><br />
   * This property is required through the extension of
   * {@link ProcessorCommand}.
   *
   * @see ProcessorCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get command(): string {
    return `ProcessOperations`;
  }

  /**
   * This method must return a *command signature* that
   * contains hints on the command name and its required
   * and optional arguments.
   * <br /><br />
   * e.g. "command <argument> [--option value]"
   * <br /><br />
   * This property is required through the extension of
   * {@link ProcessorCommand}.
   *
   * @see ProcessorCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get signature(): string {
    return `${this.command} auth|earn|referral|welcome`;
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
  protected getStateData(): OperationProcessorStateData {
    return {
      totalNumberOfOperations: this.totalNumberOfOperations,
    } as OperationProcessorStateData;
  }

  /**
   * This helper method serves as a *parser* for the `-t`
   * or `--include-types` option of this command.
   *
   * @param     {string}  transactionTypes     The transactionTypes as passed in the terminal.
   * @returns   {TransactionType[]|undefined}   An array of transaction types or undefined.
   */
  protected parseOperationTypes(operationTypes: string): string[] {
    // maps utility names to operation types
    if (operationTypes.toLowerCase().indexOf("elevate:")) {
      return [operationTypes];
    }

    // no operation types filtering means "any type"
    return [];
  }

  /**
   * This method is the **entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * the nest backend runtime is able to discover this when the
   * `processor` scope is enabled.
   * <br /><br />
   * This method is necessary to make sure this command is run
   * with the correct `--collection` option.
   * <br /><br />
   * This scheduler is registered to run **every 30 seconds**.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @param   {string[]}            passedParams
   * @param   {BaseCommandOptions}  options
   * @returns {Promise<void>}
   */
  @Cron("*/30 * * * * *", { name: "processor:cronjobs:operations" })
  public async runAsScheduler(): Promise<void> {
    // read processor configuration
    const contracts: string[] = this.configService.get<string[]>("contracts");
    const operations: OperationParameters[] =
      this.configService.get<OperationParameters[]>("operations");

    // bail out if configuration is empty
    if (!contracts || !contracts.length || !operations || !operations.length) {
      return;
    }

    // prepares execution logger
    this.logger = new Logger(`${this.scope}/${this.command}`);

    // display starting moment information in debug mode
    this.debugLog(
      `Starting operations processor for contracts: ${contracts.join(", ")}`,
    );

    // display debug information about total number of transactions
    this.debugLog(
      `Total number of operations processed: "${this.totalNumberOfOperations}"`,
    );

    let at = 0;
    do {
      // next contract to be processed
      const contract: string = contracts[at];
      const operation: OperationParameters = operations.find(
        (o) => o.contract === contract,
      );

      // if we don't know "what" and "how" to process, stop here
      if (!operation || operation.contract !== contract) {
        this.debugLog(
          `Aborting operations processor for contract "${contract}" due to missing configuration.`,
        );
        continue;
      }

      // executes the actual command logic (this will call process())
      await this.run([contract], {
        contract,
        operation,
        debug: false,
      } as ProcessorCommandOptions);
    } while (++at < contracts.length);
  }

  /**
   * This method implements the processor logic for this command
   * that will process relevant *subjects*. Subjects in this command
   * are **operations** that are included in transfer transactions on
   * dHealth Network.
   * <br /><br />
   * As of the time of writing, this scheduler currently supports the
   * following contracts:
   * - `elevate:auth`: An authentication operation (log-in action).
   * - `elevate:earn`: An earning operation (rewards).
   * - `elevate:referral` : A referral operation (invite a friend).
   * - `elevate:welcome`: An operation to welcome new users (greeting).
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {ProcessOperationsCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async process(
    options?: ProcessOperationsCommandOptions,
  ): Promise<void> {
    // reads the latest global execution state
    if (!!this.state && "totalNumberOfOperations" in this.state.data) {
      this.totalNumberOfOperations =
        this.state.data.totalNumberOfOperations ?? 0;
    }

    // per-contract synchronization: "processor:ProcessOperations:%CONTRACT%"
    const stateIdentifier = `${this.stateIdentifier}:${options.contract}`;
    const stateQueryCtr = new StateQuery({
      name: stateIdentifier,
    } as StateDocument);

    // fetch **per-contract** synchronization state once
    // Caution: do not confuse with `this.state`, this one
    // is internal and synchronizes **per each contract**.
    const state = await this.stateService.findOne(stateQueryCtr);

    // reads the latest per-source execution state
    if (!!state && "lastPageNumber" in state.data) {
      this.lastPageNumber = state.data.lastPageNumber ?? 1;
    }

    // display debug information about configuration
    if (options.debug && !options.quiet) {
      this.debugLog(
        `Last processing for "${stateIdentifier}" ended with page: "${this.lastPageNumber}"`,
      );
    }

    // check for the total number of transactions
    const transactionsState = await this.stateService.findOne(
      new StateQuery({
        name: "discovery:DiscoverTransactions",
      } as StateDocument),
    );

    const countTransactions =
      !!transactionsState &&
      "totalNumberOfTransactions" in transactionsState.data
        ? transactionsState.data.totalNumberOfTransactions
        : 0;

    // if we reached the end of transactions, we want
    // to continue *only* with recent transactions in
    // the next runs of the operations processor
    if (
      countTransactions > 0 &&
      this.lastPageNumber * 100 > countTransactions
    ) {
      this.lastPageNumber = Math.floor(countTransactions / 100);
    }

    // reads the transaction (mongo) filter query from configuration
    const transactionQuery: TransactionDocument = options.operation.query;

    // (1) each round queries 1 page of transactions from the database
    // and fetches a maximum of 5 transaction pages following the last
    this.transactions = [];
    for (
      let i = this.lastPageNumber, max = this.lastPageNumber + 5;
      i < max;
      i++, this.lastPageNumber++
    ) {
      // fetches transaction entries for this page of transactions
      // this uses the `_id` field for sorting in "asc" direction
      const transactions: PaginatedResultDTO<TransactionDocument> =
        await this.queriesService.find(
          new TransactionQuery(transactionQuery, {
            pageNumber: this.lastPageNumber,
            pageSize: 100,
            order: "asc",
          } as QueryParameters),
          this.transactionModel,
        );

      // store transactions in memory during runtime
      this.transactions = this.transactions.concat(transactions.data);

      // break if this was the last page of matching transactions
      if (transactions.isLastPage()) {
        break;
      }
    }

    // (2) each transfer transaction may contain a contract payload
    // and may or may not be relevant to the current processed operation
    const subjects: TransactionDocument[] = this.transactions
      .filter((t: TransactionDocument) => t.transactionMessage !== null)
      .filter((t: TransactionDocument) => {
        try {
          // do we have a valid contract JSON payload?
          const contract: Contract = getOperation(t.transactionMessage);

          // store a copy of the contract instance by hash
          this.contractsByHash[t.transactionHash] = contract;

          // do we have the *relevant* contract signature?
          return contract !== null && contract.signature === options.contract;
        } catch (e) {
          //console.log("Error parsing: ", e);
          return false;
        }
      });

    // debug information about upcoming database operations
    if (options.debug && !options.quiet && subjects.length > 0) {
      this.debugLog(`(${stateIdentifier}) Found ${subjects.length} operations`);
    }
    // also display debug message when no operations are executed
    else if (options.debug && !options.quiet && !subjects.length) {
      this.debugLog(`(${stateIdentifier}) No operations found`);
    }

    // (3) prepares and populates individual `operations` documents
    let nSkipped = 0;
    let nCreated = 0;
    for (let j = 0, max_s = subjects.length; j < max_s; j++) {
      // retrieve full transaction details
      const transaction: TransactionDocument = subjects[j];

      // retrieve existence information
      const documentExists: boolean = await this.operationsService.exists(
        new OperationQuery({
          transactionHash: transaction.transactionHash,
        } as OperationDocument),
      );

      // skip update for known operations
      if (true === documentExists) {
        nSkipped++;
        continue;
      }

      // extracts the previously validated payload
      const contract: Contract =
        this.contractsByHash[transaction.transactionHash];

      // create an `operations` document
      await this.model.create({
        transactionHash: this.extractTransactionHash(transaction),
        userAddress: this.extractUserAddress(transaction),
        contractSignature: contract.signature,
        contractPayload: contract.payload,
        creationBlock: this.extractTransactionBlock(transaction),
      });
      nCreated++;
    }

    // updates total counter
    this.totalNumberOfOperations += nCreated;

    if (options.debug && !options.quiet) {
      this.debugLog(
        `(${stateIdentifier}) Skipped ${nSkipped} operation(s) that already exist`,
      );
    }

    // (4) update per-contract state `lastPageNumber`
    await this.stateService.updateOne(
      stateQueryCtr, // /!\ per-contract
      {
        lastPageNumber: this.lastPageNumber,
      },
    );
    // no-return (void)
  }

  /**
   * Helper method to extract the signer address of a `TransactionDocument`
   * instance.
   *
   * @param {TransactionDocument} transaction
   * @returns {string}
   */
  protected extractUserAddress(transaction: TransactionDocument): string {
    if ("incoming" === transaction.transactionMode) {
      return transaction.signerAddress;
    }

    return transaction.recipientAddress;
  }

  /**
   * Helper method to extract the transaction hash of a mongo document
   * in the `transactions` collection.
   *
   * @param {TransactionDocument} transaction
   * @returns {string}
   */
  protected extractTransactionHash(transaction: TransactionDocument): string {
    return transaction.transactionHash;
  }

  /**
   * Helper method to extract the transaction block of a mongo document
   * in the `transactions` collection.
   *
   * @param {TransactionDocument} transaction
   * @returns {number}
   */
  protected extractTransactionBlock(transaction: TransactionDocument): number {
    return transaction.creationBlock;
  }
}
