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

// internal dependencies
// common scope
import { LogService } from "../../../common/services/LogService";
import { QueryService } from "../../../common/services/QueryService";
import { StateService } from "../../../common/services/StateService";
import {
  Account,
  AccountDocument,
  AccountModel,
  AccountQuery,
} from "../../../common/models/AccountSchema";
import { AssetParameters } from "../../../common/models/AssetsConfig";

// discovery scope
import {
  AssetQuery,
  AssetDocument,
} from "../../../discovery/models/AssetSchema";
import { AssetsService } from "../../../discovery/services/AssetsService";

// payout scope
import { PayoutsService } from "../../services/PayoutsService";
import { SignerService } from "../../services/SignerService";
import { MathService } from "../../services/MathService";
import { PayoutCommand } from "../PayoutCommand";
import {
  PreparePayouts,
  PreparePayoutsCommandOptions,
} from "../PreparePayouts";

/**
 * @interface PrepareBoosterPayoutsCommandOptions
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
export type PrepareBoosterPayoutsCommandOptions = PreparePayoutsCommandOptions;

/**
 * @label PAYOUT
 * @class PrepareBoosterPayouts
 * @description The implementation for the payout *preparation*
 * scheduler. Contains source code for the execution logic of a
 * command with name: `processor:PrepareBoosterPayouts`.
 * <br /><br />
 * Notably, this command *fetches accounts* that have not been
 * the subject of payouts yet and then *creates transactions* and
 * *signs transactions*.
 *
 * @since v0.4.0
 */
@Injectable()
export abstract class PrepareBoosterPayouts extends PreparePayouts<
  AccountDocument,
  AccountModel
> {
  /**
   * Memory store for the *booster asset configuration* object. This
   * object defines which assets are *discoverable* on dHealth Network
   * and used to *tokenize a particular booster operation*.
   * <br /><br />
   * This asset configuration is referred to as a **booster asset**
   * used in a specific dApp.
   *
   * @access protected
   * @var {AssetParameters}
   */
  protected boosterAsset: AssetParameters;

  /**
   * Constructs and prepares an instance of this scheduler.
   *
   * @param {ConfigService}   configService
   * @param {StateService}    stateService
   * @param {QueryService<AccountDocument, AccountModel>}    queryService
   * @param {PayoutsService}  payoutsService
   * @param {SignerService}   signerService
   * @param {LogService}      logService
   * @param {AssetsService}      assetsService
   * @param {MathService}     mathService
   * @param {AccountModel}   model
   */
  constructor(
    protected readonly configService: ConfigService,
    protected readonly stateService: StateService,
    protected readonly queryService: QueryService<
      AccountDocument,
      AccountModel
    >,
    protected readonly payoutsService: PayoutsService,
    protected readonly signerService: SignerService,
    protected readonly logService: LogService,
    protected readonly assetsService: AssetsService,
    protected readonly mathService: MathService,
    @InjectModel(Account.name)
    protected readonly model: AccountModel,
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
   * Memory story for the *minimum count of referrals* that were
   * confirmed for a user.
   * <br /><br />
   * The referral progress bars fills 5 steps for each level. There
   * is a maximum of 3 levels.
   *
   * @access protected
   * @abstract
   * @returns {number}
   */
  protected abstract get minReferred(): number;

  /**
   * Abstract method forwarded from {@link PayoutCommand}. This field
   * is used to improve logging and discovery of schedulers execution.
   *
   * @see BaseCommand
   * @access protected
   * @abstract
   * @returns {string}
   */
  protected abstract get command(): string;

  /**
   * This method get the daily limit for this payout.
   *
   * @access protected
   * @returns {number}
   */
  protected get payoutLimit(): number {
    const limit = this.configService.get<number>("payouts.limit.boosters");
    return limit ? limit : -1;
  }

  /**
   * This method is the **entry point** of this scheduler. It must be
   * implemented in child classes and must be decorated with a `Cron`
   * `Cron` decorator.
   * <br /><br />
   * Child classes are responsible for the registration of schedulers
   * and therefor the `Cron()` decorator is not used in this abstract
   * method definition, instead you should use the `Cron()` decorator
   * in the method implementation of child classes.
   *
   * @see BaseCommand
   * @access public
   * @abstract
   * @async
   * @param   {string[]}            passedParams
   * @param   {BaseCommandOptions}  options
   * @returns {Promise<void>}
   */
  public abstract runAsScheduler(): Promise<void>;

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
   * e.g. "accounts"
   *
   * @access protected
   * @returns {string}
   */
  protected get collection(): string {
    return "accounts";
  }

  /**
   * This method determines whether the `payoutState` and `activityAssets`
   * fields must be set on the payout subject document, or not.
   *
   * @abstract
   * @access protected
   * @returns {boolean}
   */
  protected get shouldSetSubjectPayoutState(): boolean {
    return false; // booster payouts do not require subject update
  }

  /**
   * This method verifies whether an account, as designated
   * by its address, is allowed to receive the paid out token
   * or not.
   * <br /><br />
   * This method verifies the entries in the `assets` collection
   * to determine whether a user has been previously assigned a
   * token or not.
   *
   * @access protected
   * @async
   * @param   {AccountDocument}   attributionSubject  The recipient account.
   * @returns {Promise<boolean>}
   */
  protected async verifyAttributionAllowance(
    attributionSubject: AccountDocument,
  ): Promise<boolean> {
    // denies attribution given an already existing
    // `assets` document for this subject and token
    const alreadyExists = await this.assetsService.exists(
      new AssetQuery({
        userAddress: attributionSubject.address,
        mosaicId: this.boosterAsset.mosaicId,
      } as AssetDocument),
    );

    // CAUTION: booster assets can be owned ONCE only
    if (true === alreadyExists) {
      return false; // denied attribution
    }

    return true;
  }

  /**
   * This method returns an array of *accounts* that satisfy
   * the following conditions:
   * - The account has referred exactly 5 users ;
   * <br /><br />
   * Entries are sorted using the field `createdAt` in ascending
   * direction. A maximum number of `10` accounts are returned.
   *
   * @access protected
   * @async
   * @returns {Promise<AccountDocument[]>}
   */
  protected async fetchSubjects(): Promise<AccountDocument[]> {
    // prepare aggregation operations
    const aggregateQuery = [
      {
        $match: {
          referredBy: { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            referredBy: "$referredBy",
          },
          count: { $sum: 1 },
        },
      },
    ];

    // query statistics aggregation
    const results = await this.queryService.aggregate(
      aggregateQuery,
      this.model,
    );

    // prepare documents
    const output: AccountDocument[] = [];
    for (const referrer of results) {
      const address = referrer._id.referredBy;
      const cntRefs = referrer.count;

      // boosters are unlocked at specific total
      // number of referrals
      if (null === address || cntRefs !== this.minReferred) {
        continue;
      }

      const account = await this.queryService.findOne(
        new AccountQuery({ address } as AccountDocument),
        this.model,
      );

      // verifies whether the subject can receive the
      // token or not (can be owned once only)
      const canReceiveToken = await this.verifyAttributionAllowance(account);
      if (true === canReceiveToken) {
        output.push(account);
      }
    }

    // return `accounts` document that have referred
    // 10, 50 or 100 other accounts
    return output.slice(0, 10);
  }

  /**
   * This method must *update* a payout subject document. Note
   * that subjects *are the subject of a payout execution*.
   *
   * @param   {AccountDocument}      subject     The document being updated.
   * @param   {Record<string, any>}   updateData  The columns and their respective value.
   * @returns {Promise<AccountDocument>}    The updated document.
   */
  protected async updatePayoutSubject(
    subject: AccountDocument,
    updateData: Record<string, any>,
  ): Promise<AccountDocument> {
    return await this.queryService.createOrUpdate(
      new AccountQuery({
        slug: subject.slug,
      } as AccountDocument),
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
    // account payouts create transfer transactions
    // that contain the runtime's "booster" assets.
    return this.boosterAsset.mosaicId;
  }

  /**
   * This method must return an asset amount which will be
   * attached to a transfer transaction.
   *
   * @access protected
   * @param   {AccountDocument}  subject   The payout *subject* (activity) of which `activityData` is used.
   * @param   {number}  multiplier   The amount multiplier (in case of "boosters"). Defaults to `1`.
   * @returns {number}    An amount that is computed and depends on the *intensity* of an activity.
   */
  protected getAssetAmount(subject: AccountDocument, multiplier = 1): number {
    // booster assets are unique non-transferrable tokens
    // each account should always own only one of these
    return 1;
  }

  /**
   * This method must return a multiplier that is applied to
   * payout amounts. This is used internally to add boosters
   * when users have referred a specific number of accounts.
   *
   * @abstract
   * @access protected
   * @returns {number} Booster payouts always return an amount (and multiplier) of `1`.
   */
  protected async getMultiplier(subjectAddress: string): Promise<number> {
    return Promise.resolve(1); // no multiplier applies for boosters (always 1)
  }

  /**
   * This method returns an asset amount of which the user
   * has been rewarded today.
   *
   * @access protected
   * @async
   * @param {string} address The address which we will gather reward amount from.
   * @returns {Promise<number>} The total reward amount which this account has received today.
   */
  protected async getEarnedAssetAmountToday(address: string): Promise<number> {
    return Promise.resolve(0); // not applicable for boosters for now
  }
}
