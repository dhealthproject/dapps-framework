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
// common scope
import { LogService } from "../../../common/services/LogService";
import { QueryService } from "../../../common/services/QueryService";
import { StateService } from "../../../common/services/StateService";

// users scope
import {
  Activity,
  ActivityDocument,
  ActivityModel,
  ActivityQuery,
} from "../../../users/models/ActivitySchema";
import { ProcessingState } from "../../../users/models/ProcessingStatusDTO";

// payout scope
import { PayoutsService } from "../../services/PayoutsService";
import { SignerService } from "../../services/SignerService";
import { MathService } from "../../services/MathService";
import { PayoutState } from "../../models/PayoutStatusDTO";
import { PayoutCommand, PayoutCommandOptions } from "../PayoutCommand";
import {
  PreparePayouts,
  PreparePayoutsCommandOptions,
} from "../PreparePayouts";

/**
 * @interface PrepareActivityPayoutsCommandOptions
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
export type PrepareActivityPayoutsCommandOptions = PreparePayoutsCommandOptions;

/**
 * @label PAYOUT
 * @class PrepareActivityPayouts
 * @description The implementation for the payout *preparation*
 * scheduler. Contains source code for the execution logic of a
 * command with name: `processor:PrepareActivityPayouts`.
 * <br /><br />
 * Notably, this command *fetches activities* that have not been
 * the subject of payouts yet and then *creates transactions* and
 * *signs transactions*.
 *
 * @since v0.4.0
 */
@Injectable()
export class PrepareActivityPayouts extends PreparePayouts<
  ActivityDocument,
  ActivityModel
> {
  /**
   * Constructs and prepares an instance of this scheduler.
   *
   * @param {ConfigService}   configService
   * @param {StateService}    stateService
   * @param {QueryService<ActivityDocument, ActivityModel>}    queryService
   * @param {PayoutsService}  payoutsService
   * @param {SignerService}   signerService
   * @param {MathService}     mathService
   * @param {ActivityModel}   model
   */
  constructor(
    protected readonly configService: ConfigService,
    protected readonly stateService: StateService,
    protected readonly queryService: QueryService<
      ActivityDocument,
      ActivityModel
    >,
    protected readonly payoutsService: PayoutsService,
    protected readonly signerService: SignerService,
    protected readonly logService: LogService,
    protected readonly mathService: MathService,
    @InjectModel(Activity.name)
    protected readonly model: ActivityModel,
  ) {
    // required super call
    super(
      configService,
      stateService,
      queryService,
      payoutsService,
      signerService,
      logService,
    );
  }

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "scope:name"
   * <br /><br />
   * This property is required through the extension of
   * {@link PayoutCommand}.
   *
   * @see PayoutCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get command(): string {
    return `PrepareActivityPayouts`;
  }

  /**
   * This method must return a *command signature* that
   * contains hints on the command name and its required
   * and optional arguments.
   * <br /><br />
   * e.g. "command <argument> [--option value]"
   * <br /><br />
   * This property is required through the extension of
   * {@link PayoutCommand}.
   *
   * @see PayoutCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get signature(): string {
    return `${this.command}`;
  }

  /**
   * This method must return a *database collection* which
   * is used to *discover subjects* for this preparation.
   * <br /><br />
   * e.g. "activities"
   *
   * @access protected
   * @returns {string}
   */
  protected get collection(): string {
    return "activities";
  }

  /**
   * This method returns an array of *activities* that satisfy
   * the following conditions:
   * - The field `processingState` must contain `0` ; and
   * - The field `payoutState` must contain `0`
   * <br /><br />
   * Entries are sorted using the field `createdAt` in ascending
   * direction. A maximum number of `10` activities are returned.
   *
   * @access protected
   * @async
   * @returns {Promise<ActivityDocument[]>}
   */
  protected async fetchSubjects(): Promise<ActivityDocument[]> {
    // queries *one page* of 10 `activities` documents for which
    // the *processing state* is currently `Not_Processed` and
    // the *payout state* is currently `Not_Started`.
    const page = await this.queryService.find(
      new ActivityQuery(
        {
          processingState: ProcessingState.Processed,
          payoutState: PayoutState.Not_Started,
        } as ActivityDocument,
        {
          pageNumber: 1,
          pageSize: 10,
          sort: "createdAt",
          order: "asc",
        },
      ),
      this.model,
    );

    // return 1 page's documents
    return page.data;
  }

  /**
   * This method must *update* a payout subject document. Note
   * that subjects *are the subject of a payout execution*.
   *
   * @param   {ActivityDocument}      subject     The document being updated.
   * @param   {Record<string, any>}   updateData  The columns and their respective value.
   * @returns {Promise<ActivityDocument>}    The updated document.
   */
  protected async updatePayoutSubject(
    subject: ActivityDocument,
    updateData: Record<string, any>,
  ): Promise<ActivityDocument> {
    return await this.queryService.createOrUpdate(
      new ActivityQuery({
        slug: subject.slug,
      } as ActivityDocument),
      this.model,
      updateData,
    );
  }

  /**
   * This method must return an asset identifier which will
   * be used in a transfer transaction.
   *
   * @access protected
   * @returns {string}
   */
  protected getAssetIdentifier(): string {
    // activity payouts create transfer transactions
    // that contain the runtime's "earn" assets.
    return this.earnAsset.mosaicId;
  }

  /**
   * This method must return an asset amount which will be
   * attached to a transfer transaction.
   * <br /><br />
   * Note that an *empty total time elapsed* will always
   * return a `0`-amount. The total time elapsed in used
   * in the formula in a division operation.
   * <br /><br />
   * This implementation defines the *payout formula* used to
   * compute *asset amounts* depending on the *intensity* of an
   * activity. Note that the `activityData` field *must* contain
   * fields including:
   * - `calories`: Number of `kilocalories` burned (`C || kC`).
   * - `distance`: Number of `meters` distance (`D`). (* some formula express this in different unit of measure)
   * - `elevation`: Number of `meters` elevation gain (`E || A`). This field uses an adjusted value in case it is empty.
   * - `elapsedTime`: Number of `seconds` spent during activity (`T`).
   * - `kilojoules`: Number of `kilojoules` produced during activity (Rides only) (`J`).
   * <br /><br />
   * Note that the below listed formula *may use* a different unit of measure
   * than the one listed in the database, e.g. in-formula the distance may be
   * used and expressed in *centimeters* or *dekameters* depending of sports.
   * <br /><br />
   * Following formulas are currently applied to compute amounts:
   * - *Walk*:    `(D / T) x 1.2`
   * - *Run*:     `(D / T) x 1.5`
   * - *Ride*:    `(D / T) x 0.8`
   * - *Swim*:    `((D*10) / T) x 1.7`
   * - *Others*:  `(D / T) x 1.6`
   * <br /><br />
   * Note that in the case of an *elevation* gain that is `0`,
   * we use the Health2Earn v0 *skew-normal* distribution to
   * generate a random number that will deviate between `0.5`
   * and `1.5`. This is necessary to avoid zeroing out factor
   * two of the formula.
   *
   * @todo document formula in developer documentations
   * @access protected
   * @param   {ActivityDocument}  subject   The payout *subject* (activity) of which `activityData` is used.
   * @returns {number}    An amount that is computed and depends on the *intensity* of an activity.
   */
  protected getAssetAmount(subject: ActivityDocument): number {
    // extracts fields used for computing the reward amount
    const {
      distance: D, // in-formula, distance is `D`
      elapsedTime: T, // in-formula, elapsedTime is `T`
      isManual: isCraftedByHand,
    } = subject.activityData;

    // note that the *time elapsed* is used in division
    // this removes the potential for division-by-zero
    if (T <= 0 || isCraftedByHand === true) return 0;

    // @see https://developers.strava.com/docs/reference/#api-models-SportType
    // This method uses abbreviated variable names in order to keep
    // readability high-enough for arithmetical operations.
    let amount: number;
    if ("Walk" === subject.activityData.sport) {
      // WALKING
      // (D / T) x 1.2
      amount = (D / T) * 1.2;
    } else if ("Run" === subject.activityData.sport) {
      // RUNNING
      // (D / T) x 1.5
      amount = (D / T) * 1.5;
    } else if ("Ride" === subject.activityData.sport) {
      // RIDING
      // (D / T) x 0.8
      amount = (D / T) * 0.8;
    } else if ("Swim" === subject.activityData.sport) {
      // SWIMMING
      // ((D*10) / T) x 1.7
      // uses *dekameters* in distance
      const dM = D * 10;
      amount = (dM / T) * 1.7;
    } else {
      // OTHERS
      // (D / T) x 1.6
      amount = (D / T) * 1.6;
    }

    // make sure to work only with *integers* (always absolute amounts)
    const divisibility: number = parseInt("" + this.earnAsset.divisibility);
    return Math.round(Math.floor(amount * Math.pow(10, divisibility)));
  }

  /**
   * This method is the **entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * the nest backend runtime is able to discover this when the
   * `processor` scope is enabled.
   * <br /><br />
   * This method is necessary to make sure this command is run
   * with the correct `--signer` option.
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
  @Cron("*/30 * * * * *", { name: "payout:cronjobs:prepare" })
  public async runAsScheduler(): Promise<void> {
    // prepares execution logger
    this.logger.setModule(`${this.scope}/${this.command}`);

    // display starting moment information also in non-debug mode
    this.debugLog(
      `Starting payout preparation for subjects type: ${this.collection}`,
    );

    // display debug information about total number of transactions
    this.debugLog(
      `Total number of payouts prepared: "${this.totalNumberPrepared}"`,
    );

    // executes the actual command logic (this will call execute())
    await this.run([this.collection], {
      debug: true,
    } as PayoutCommandOptions);
  }
}
