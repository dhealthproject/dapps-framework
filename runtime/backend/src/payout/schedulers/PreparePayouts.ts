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
import { Earn as EarnContract } from "@dhealth/contracts";
import { SignedTransaction, TransferTransaction } from "@dhealth/sdk";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Model } from "mongoose";
import moment from "moment";

// internal dependencies
// common scope
import { AssetParameters } from "../../common/models/AssetsConfig";
import { QueryService } from "../../common/services/QueryService";
import { StateService } from "../../common/services/StateService";

// payout scope
import { PayoutCommand, PayoutCommandOptions } from "./PayoutCommand";
import { Subjectable } from "../concerns/Subjectable";
import { PayoutPreparationStateData } from "../models/PayoutPreparationStateData";
import { PayoutDocument, PayoutQuery } from "../models/PayoutSchema";
import { PayoutState } from "../models/PayoutStatusDTO";
import { PayoutsService } from "../services/PayoutsService";
import { SignerService } from "../services/SignerService";

/**
 * @interface PreparePayoutsCommandOptions
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
export type PreparePayoutsCommandOptions = PayoutCommandOptions;

/**
 * @class PreparePayouts
 * @description The implementation for the payout *preparation*
 * scheduler. Contains source code for the execution logic of a
 * command with name: `processor:PreparePayouts`.
 * <br /><br />
 * Notably, this command *fetches activities* that have not been
 * the subject of payouts yet and then *creates transactions* and
 * *signs transactions*.
 *
 * @since v0.4.0
 */
@Injectable()
export abstract class PreparePayouts<
  TDocument extends Subjectable /* extends Documentable */,
  TModel extends Model<TDocument, {}, {}, {}> = Model<TDocument>,
> extends PayoutCommand {
  /**
   * Memory store for the total number of *prepared* payouts. This is used
   * in {@link getStateData} to update the latest execution state.
   *
   * @access private
   * @var {number}
   */
  protected totalNumberPrepared: number;

  /**
   * Memory store for the *fees asset configuration* object. This
   * object defines which assets are *discoverable* on dHealth Network
   * and used to pay for *transaction fees*.
   * <br /><br />
   * This asset configuration is referred to as the **base asset**
   * used in a specific dApp. The reason for this is that transactions
   * on the underlying dHealth Network are always paid with one and the
   * same asset.
   *
   * @access protected
   * @var {DiscoverableAssetsMap}
   */
  protected baseAsset: AssetParameters;

  /**
   * Memory store for the *earn asset configuration* object. This
   * object defines which assets are *discoverable* on dHealth Network
   * and used to *tokenize a particular operation*.
   * <br /><br />
   * This asset configuration is referred to as the **earn asset**
   * used in a specific dApp. The reason for this is that individual
   * dApps may want their end-users to earn a custom asset, or not.
   *
   * @access protected
   * @var {DiscoverableAssetsMap}
   */
  protected earnAsset: AssetParameters;

  /**
   * Contains the *dApp Identifier* as attached to contracts on-chain.
   * Typically, the dApp identifier is created using a slug-format of
   * the `dappName` configuration inside `config/dapp.ts`.
   *
   * @access protected
   * @var {string}
   */
  protected dappIdentifier: string;

  /**
   * Constructs and prepares an instance of this scheduler abstraction
   * layer.
   *
   * @param {ConfigService}   configService
   * @param {StateService}    stateService
   * @param {QueryService<TDocument, TModel>}   queryService
   * @param {PayoutsService}  payoutsService
   * @param {SignerService}   signerService
   */
  constructor(
    protected readonly configService: ConfigService,
    protected readonly stateService: StateService,
    protected readonly queryService: QueryService<TDocument, TModel>,
    protected readonly payoutsService: PayoutsService,
    protected readonly signerService: SignerService,
  ) {
    // required super call
    super(stateService);

    // sets default state data
    this.totalNumberPrepared = 0;

    // setup assets configuration
    this.baseAsset = this.configService.get<AssetParameters>("assets.base");
    this.earnAsset = this.configService.get<AssetParameters>("assets.earn");

    // setup contracts payload
    // @todo this should use `DappHelper.slugify()`
    const dappName = this.configService.get<string>("dappName");
    this.dappIdentifier = (dappName ?? "dapp").toLowerCase();
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
  protected getStateData(): PayoutPreparationStateData {
    return {
      totalNumberPrepared: this.totalNumberPrepared,
    } as PayoutPreparationStateData;
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
   * This method must return an *array of subjects*. Note that
   * subjects *will be the subject of a payout execution*.
   *
   * @abstract
   * @access protected
   * @returns {Promise<TDocument[]>}
   */
  protected abstract fetchSubjects(): Promise<TDocument[]>;

  /**
   * This method must *update* a payout subject document. Note
   * that subjects *are the subject of a payout execution*.
   *
   * @param   {TDocument}             subject     The document being updated.
   * @param   {Record<string, any>}   updateData  The columns and their respective value.
   * @returns {Promise<TDocument>}    The updated document.
   */
  protected abstract updatePayoutSubject(
    subject: TDocument,
    updateData: Record<string, any>,
  ): Promise<TDocument>;

  /**
   * This method must return an asset identifier which will
   * be used in a transfer transaction.
   *
   * @abstract
   * @access protected
   * @returns {string}
   */
  protected abstract getAssetIdentifier(): string;

  /**
   * This method must return an asset amount which will be
   * attached to a transfer transaction.
   *
   * @abstract
   * @access protected
   * @returns {number}
   */
  protected abstract getAssetAmount(subject: TDocument): number;

  /**
   * This method implements the processor logic for this command
   * that will prepare relevant *subjects*' payout entities. Subjects
   * in this command are defined by the {@link PreparePayouts.collection}
   * implementation.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {PreparePayoutsCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async execute(options?: PreparePayoutsCommandOptions): Promise<void> {
    // reads the latest global execution state
    if (!!this.state && "totalNumberPrepared" in this.state.data) {
      this.totalNumberPrepared = this.state.data.totalNumberPrepared ?? 0;
    }

    // (1) discover relevant subjects for this payout preparation
    // Note that the implementation of `fetchSubjects()` is delegated
    // to child classes such that we can implement different payout
    // strategies more easily, e.g. using profiles, etc.
    const subjects: TDocument[] = await this.fetchSubjects();

    // debug information about discovered subjects
    if (options.debug && !options.quiet && subjects.length > 0) {
      this.debugLog(
        `Found ${subjects.length} subject(s) in ${this.collection}`,
      );
    }
    // also display debug message when no subjects are discovered
    else if (options.debug && !options.quiet && !subjects.length) {
      this.debugLog(`No subjects discovered in ${this.collection}`);
    }

    // (2) for each discovered subject, we can now prepare a payout
    let nCreated = 0;
    for (let j = 0, max_s = subjects.length; j < max_s; j++) {
      // retrieve full subject details
      const subject: TDocument = subjects[j];
      const subjectDate = subject.createdAt; // @see Subjectable
      const subjectSlug = subject.slug; // @see Subjectable
      const subjectAddr = subject.address; // @see Subjectable
      const payoutQuery = {
        subjectSlug,
        subjectCollection: this.collection,
        userAddress: subjectAddr,
      };

      // read subject related fields
      const mosaicId: string = this.getAssetIdentifier();
      const theAmount: number = this.getAssetAmount(subject);

      // empty reward amounts are *not* rewarded
      // CAUTION: this disables manual activity rewards
      if (theAmount <= 0) {
        // update `payouts` state to `Not_Eligible`
        await this.payoutsService.createOrUpdate(
          new PayoutQuery(payoutQuery as PayoutDocument),
          { payoutState: PayoutState.Not_Eligible },
        );

        // continue to next payout
        continue;
      }

      // creates an EARN contract operation
      const contract: EarnContract = new EarnContract(
        {
          dappIdentifier: this.dappIdentifier,
          date: moment(subjectDate).format("YYYY-MM-DD"), //XXX exact date?
          asset: mosaicId,
          amount: theAmount,
        },
        1,
      );

      // creates the *unsigned* transaction
      // @todo contract transaction parameters should define FEES
      const transfer: TransferTransaction = contract.toTransaction({
        recipientAddress: subject.address,
        signerPublicKey: this.signerService.getSignerPublicKey(),
      });

      // (3) SIGN the transaction (make it storage-secure)
      // after this, the transaction *cannot be modified* anymore
      const signedTransfer = this.signerService.signTransaction(transfer);

      // print INFO log for every transaction with tokens
      this.infoLog(
        `Signed a payout with assets: ` +
          `${theAmount} ${mosaicId} (${signedTransfer.hash})`,
      );

      // creates a `payouts` document that will be used
      // in follow-up steps (broadcast + verify)
      await this.payoutsService.createOrUpdate(
        new PayoutQuery(payoutQuery as PayoutDocument),
        {
          payoutState: PayoutState.Prepared,
          payoutAssets: [{ mosaicId, amount: theAmount }],
          signedBytes: signedTransfer.payload,
          transactionHash: signedTransfer.hash,
        },
      );

      // (4) updates the *subject* so that it won't be considered
      // a subject for following executions of this command
      // Note that the implementation of `updatePayoutSubject()` is delegated
      // to child classes such that we can implement different payout
      // strategies more easily, e.g. using profiles, etc.
      await this.updatePayoutSubject(subject, {
        payoutState: PayoutState.Prepared,
        activityAssets: [{ mosaicId, amount: theAmount }],
      });

      nCreated++;
    }

    // updates total counter
    this.totalNumberPrepared += nCreated;

    // no-return (void)
  }
}
