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
  SignedTransaction,
  TransactionMapping,
  TransferTransaction,
} from "@dhealth/sdk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Model } from "mongoose";

// internal dependencies
// common scope
import { LogService } from "../../common/services/LogService";
import { NetworkService } from "../../common/services/NetworkService";
import { QueryService } from "../../common/services/QueryService";
import { StateService } from "../../common/services/StateService";

// processor scope
// @todo decouple payout from processor by using dynamic "activities" query
import { ActivitiesService } from "../../processor/services/ActivitiesService";
import {
  ActivityQuery,
  ActivityDocument,
} from "../../processor/models/ActivitySchema";

// payout scope
import { Subjectable } from "../concerns/Subjectable";
import { PayoutCommand, PayoutCommandOptions } from "./PayoutCommand";
import { PayoutBroadcastStateData } from "../models/PayoutBroadcastStateData";
import { PayoutDocument, PayoutQuery } from "../models/PayoutSchema";
import { PayoutState } from "../models/PayoutStatusDTO";
import { PayoutsService } from "../services/PayoutsService";
import { SignerService } from "../services/SignerService";

/**
 * @interface BroadcastPayoutsCommandOptions
 * @description This interface defines **arguments** that can be
 * passed to this **processor** command that is implemented in the
 * backend runtime.
 * <br /><br />
 * Note that it is important that child classes extend this interface
 * with their own specification of arguments.
 * <br /><br />
 * Additional note relating to this implementation is that the payout
 * preparation command does not need any other command options.
 *
 * @see PayoutCommandOptions
 * @since v0.4.0
 */
export interface BroadcastPayoutsCommandOptions extends PayoutCommandOptions {
  /**
   * Defines the maximum number of broadcast operations that will
   * be executed with this command execution.
   *
   * @access public
   * @var {number}
   */
  maxCount: number;
}

/**
 * @class BroadcastPayouts
 * @description The implementation for the payout *preparation*
 * scheduler. Contains source code for the execution logic of a
 * command with name: `processor:BroadcastPayouts`.
 * <br /><br />
 * Notably, this command *fetches activities* that have not been
 * the subject of payouts yet and then *creates transactions* and
 * *signs transactions*.
 *
 * @since v0.4.0
 */
@Injectable()
export abstract class BroadcastPayouts<
  TDocument extends Subjectable /* extends Documentable */,
  TModel extends Model<TDocument, {}, {}, {}> = Model<TDocument>,
> extends PayoutCommand {
  /**
   * Memory store for *all* transactions that must be broadcast during
   * this execution of the command.
   *
   * @access protected
   * @var {Record<string, TransferTransaction>}
   */
  protected transactions: Record<string, TransferTransaction>;

  /**
   * Contains an array of transaction hashes that are ready to
   * be broadcast to the network.
   *
   * @access protected
   * @var {string[]}
   */
  protected transactionHashes: string[];

  /**
   * Memory store for the last time of execution. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  private lastExecutedAt: number;

  /**
   * Contains a *boolean* value that determines whether the runtime
   * is currently using a **global dry-run mode**.
   * <br /><br />
   * Note that **dry-run mode** disables payout broadcasts, as such
   * transactions will *not* appear on dHealth Network.
   *
   * @access protected
   * @var {boolean}
   */
  protected globalDryRun: boolean;

  /**
   * Contains a *boolean* value that determines whether transactions
   * must be batched if possible (aggregate complete).
   *
   * @access protected
   * @var {boolean}
   */
  protected enableBatches: boolean;

  /**
   * Contains the *size of batches*. This field is only used given
   * {@link BroadcastPayouts.enableBatches} is `true` and determines
   * the size of transaction batches.
   *
   * @access protected
   * @var {number}
   */
  protected batchSize: number;

  /**
   * Constructs and prepares an instance of this scheduler abstraction
   * layer.
   *
   * @param {ConfigService}   configService
   * @param {StateService}    stateService
   * @param {QueryService<TDocument, TModel>}   queryService
   * @param {PayoutsService}  payoutsService
   * @param {SignerService}   signerService
   * @param {NetworkService}  networkService
   * @param {ActivitiesService}  activitiesService
   */
  constructor(
    protected readonly configService: ConfigService,
    protected readonly stateService: StateService,
    protected readonly queryService: QueryService<TDocument, TModel>,
    protected readonly payoutsService: PayoutsService,
    protected readonly signerService: SignerService,
    protected readonly networkService: NetworkService,
    protected readonly activitiesService: ActivitiesService,
    protected readonly logService: LogService,
  ) {
    // required super call
    super(logService, stateService);

    // setup batching
    this.batchSize = this.configService.get<number>("payouts.batchSize");
    this.enableBatches = this.configService.get<boolean>(
      "payouts.enableBatches",
    );

    // sets default state data
    this.lastExecutedAt = new Date().valueOf();

    // configures dry-run mode
    this.globalDryRun = this.configService.get<boolean>("globalDryRun");
    this.transactions = {};
    this.transactionHashes = [];
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
   * @returns {PayoutBroadcastStateData}
   */
  protected getStateData(): PayoutBroadcastStateData {
    return {
      lastExecutedAt: this.lastExecutedAt,
    } as PayoutBroadcastStateData;
  }

  /**
   * This method must return a *database collection* which
   * is used to *discover subjects* for this preparation.
   * <br /><br />
   * e.g. "activities"
   *
   * @abstract
   * @access protected
   * @returns {string}
   */
  protected abstract get collection(): string;

  /**
   * This method must return a total count of subjects.
   *
   * @abstract
   * @access protected
   * @returns {Promise<number>}
   */
  protected abstract countSubjects(): Promise<number>;

  /**
   * This method must return an *array of subjects*. Note that
   * subjects *will be the subject of a payout broadcast*.
   *
   * @abstract
   * @access protected
   * @param   {number}    count     The count of subjects to retrieve.
   * @returns {Promise<PayoutDocument[]>}
   */
  protected abstract fetchSubjects(count: number): Promise<PayoutDocument[]>;

  /**
   * This method implements the processor logic for this command
   * that will prepare relevant *subjects*' payout entities. Subjects
   * in this command are defined by the {@link BroadcastPayouts.collection}
   * implementation.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {BroadcastPayoutsCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async execute(
    options?: BroadcastPayoutsCommandOptions,
  ): Promise<void> {
    let broadcastMode = "PROD";
    if (this.globalDryRun === true || options.dryRun === true) {
      if (options.debug && !options.quiet) {
        this.debugLog(`[DRY-RUN] The dry-run mode is enabled for this command`);
      }
      broadcastMode = "DRY-RUN";
    }

    // (1) discover relevant subjects for this payout broadcast
    // Note that the implementation of `fetchSubjects()` is delegated
    // to child classes such that we can implement different payout
    // strategies more easily, e.g. broadcasting by different events
    const payouts: PayoutDocument[] = await this.fetchSubjects(
      options.maxCount,
    );

    // counts the number of eligible payouts in queue
    const countInQueue: number = await this.countSubjects();

    // debug information about discovered payouts
    if (options.debug && !options.quiet && payouts.length > 0) {
      this.debugLog(
        `[${broadcastMode}] Found ${payouts.length} broadcast-able ` +
          `transaction(s) in queue of ${countInQueue} eligible payouts.`,
      );
    }
    // also display debug message when no payouts are discovered
    // also, break if no broadcast action is currently pending
    else if (!payouts.length) {
      if (options.debug && !options.quiet) {
        this.debugLog(
          `[${broadcastMode}] No broadcast-able transactions found`,
        );
      }

      // return void
      return;
    }

    // (2) for each discovered subject, we can now broadcast the payout
    // so we update the database document so that it reflects that
    for (
      let j = 0, max_s = Math.min(payouts.length, options.maxCount);
      j < max_s;
      j++
    ) {
      // retrieve full subject details
      const payout: PayoutDocument = payouts[j];

      // forcefully skip non-eligible payouts
      if (payout.payoutState !== PayoutState.Prepared) {
        continue;
      }

      // rebuilds the transaction from signed payload
      const transfer: TransferTransaction =
        TransactionMapping.createFromPayload(
          payout.signedBytes,
          false,
        ) as TransferTransaction;

      // store a copy of the re-built transfer instance
      this.transactionHashes.push(payout.transactionHash);
      this.transactions[payout.transactionHash] = transfer;
    }

    // (3) determines whether the broadcast transactions must
    // be *batched together* using a wrapper (aggregate complete)
    // or whether transactions are to be broadcast as stand-alone
    // let broadcastTransactions: SignedTransaction[];
    // if (true === this.enableBatches) {
    //   // wraps the transactions in an aggregate complete wrapper
    //   broadcastTransactions.push(AggregateTransaction.createComplete(
    //     this.transactions[0].deadline,
    //     this.transactions.map(
    //       transfer => transfer.toAggregate(
    //         this.signerService.getSignerPublicAccount()
    //       )
    //     ),
    //     this.transactions[0].networkType,
    //     [], // no-cosignatures necessary
    //   ));
    // }
    // stand-alone (multi-broadcast)
    // else {
    // each transaction is broadcast on its own
    const broadcastTransactions: SignedTransaction[] =
      this.transactionHashes.map((transactionHash) => {
        const t = this.transactions[transactionHash];
        return new SignedTransaction(
          t.serialize(),
          transactionHash,
          t.signer.publicKey,
          t.type,
          t.networkType,
        );
      });
    // }

    // (4) broadcast the (batch or stand-alone) transaction(s)
    // using delegated promises with nodes from dHealth Network
    if (!this.globalDryRun && !options.dryRun) {
      // log information about broadcast operations
      this.infoLog(
        `Now broadcasting ${broadcastTransactions.length} transaction(s)`,
      );

      // CAUTION: dry-run mode disables this block
      const repository = this.networkService.transactionRepository;
      await this.networkService.delegatePromises(
        broadcastTransactions.map((t) => repository.announce(t).toPromise()),
      );

      // updates the *payouts* so that they won't be considered
      // a payout for future/parallel executions of this command
      // CAUTION: dry-run mode disables this block
      for (
        let u = 0, max_s = Math.min(payouts.length, options.maxCount);
        u < max_s;
        u++
      ) {
        // retrieve full subject details
        const payout: PayoutDocument = payouts[u];

        // forcefully skip non-eligible payouts
        if (payout.payoutState !== PayoutState.Prepared) {
          continue;
        }

        // updates the `payouts` entry
        await this.payoutsService.createOrUpdate(
          new PayoutQuery({
            userAddress: payout.userAddress,
            subjectSlug: payout.subjectSlug,
            subjectCollection: this.collection,
          } as PayoutDocument),
          {
            payoutState: PayoutState.Broadcast,
          },
        );

        // updates the payout subject document (e.g. "activities" document)
        await this.activitiesService.createOrUpdate(
          new ActivityQuery({
            slug: payout.subjectSlug,
          } as ActivityDocument),
          {
            payoutState: PayoutState.Broadcast,
          },
        );
      }
    }
    // in dry-run mode:
    else {
      // log information about skipped operations
      this.infoLog(
        `Skipped broadcast of ${broadcastTransactions.length} transaction(s)`,
      );
    }

    // no-return (void)
  }
}
