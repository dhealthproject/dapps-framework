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
import { ConfigService } from "@nestjs/config";
import { Cron } from "@nestjs/schedule";

// internal dependencies
// common scope
import { LogService } from "../../../common/services/LogService";
import { NetworkService } from "../../../common/services/NetworkService";
import { StateService } from "../../../common/services/StateService";
import { QueryService } from "../../../common/services/QueryService";
import {
  Account,
  AccountDocument,
  AccountModel,
} from "../../../common/models/AccountSchema";
import { AssetParameters } from "../../../common/models/AssetsConfig";

// discovery scope
import { AssetsService } from "../../../discovery/services/AssetsService";

// users scope
import { ActivitiesService } from "../../../users/services/ActivitiesService";

// payout scope
import {
  BroadcastPayouts,
  BroadcastPayoutsCommandOptions,
} from "../BroadcastPayouts";
import { PayoutCommand } from "../PayoutCommand";
import { PayoutDocument, PayoutQuery } from "../../models/PayoutSchema";
import { PayoutState } from "../../models/PayoutStatusDTO";
import { PayoutsService } from "../../services/PayoutsService";
import { SignerService } from "../../services/SignerService";

/**
 * @interface BroadcastBoosterPayoutsCommandOptions
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
export type BroadcastBoosterPayoutsCommandOptions =
  BroadcastPayoutsCommandOptions;

/**
 * @label PAYOUT
 * @class BroadcastBoosterPayouts
 * @description The implementation for the payout *preparation*
 * scheduler. Contains source code for the execution logic of a
 * command with name: `processor:BroadcastBoosterPayouts`.
 * <br /><br />
 * Notably, this command *fetches activities* that have not been
 * the subject of payouts yet and then *creates transactions* and
 * *signs transactions*.
 *
 * @since v0.4.0
 */
@Injectable()
export class BroadcastBoosterPayouts extends BroadcastPayouts<
  AccountDocument,
  AccountModel
> {
  /**
   * Constructs and prepares an instance of this scheduler.
   *
   * @param {ConfigService}   configService
   * @param {StateService}    stateService
   * @param {QueryService<AccountDocument, AccountModel>}    queryService
   * @param {PayoutsService}  payoutsService
   * @param {SignerService}   signerService
   * @param {NetworkService}  networkService
   * @param {ActivitiesService}  activitiesService
   * @param {LogService}      logService
   * @param {AssetsService}      assetsService
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
    protected readonly networkService: NetworkService,
    protected readonly activitiesService: ActivitiesService,
    protected readonly logService: LogService,
    protected readonly assetsService: AssetsService,
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
      networkService,
      activitiesService,
      logService,
      assetsService,
    );
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
    return "accounts";
  }

  /**
   * This method must return a total count of subjects.
   *
   * @abstract
   * @access protected
   * @returns {Promise<number>}
   */
  protected async countSubjects(): Promise<number> {
    // executes a `count()` query on the `payouts` collection
    return await this.payoutsService.count(
      new PayoutQuery({
        payoutState: PayoutState.Prepared,
        subjectCollection: this.collection,
      } as PayoutDocument),
    );
  }

  /**
   * This method must return an *array of subjects*. Note that
   * subjects *will be the subject of a payout execution*.
   *
   * @access protected
   * @async
   * @param   {number}    count     The count of subjects to retrieve.
   * @returns {Promise<PayoutDocument[]>}
   */
  protected async fetchSubjects(count: number): Promise<PayoutDocument[]> {
    // queries *one page* of 10 `payouts` documents for which
    // the *processing state* is currently `Prepared`.
    const page = await this.payoutsService.find(
      new PayoutQuery(
        {
          payoutState: PayoutState.Prepared,
          subjectCollection: this.collection,
        } as PayoutDocument,
        {
          pageNumber: 1,
          pageSize: count,
          sort: "createdAt",
          order: "asc",
        },
      ),
    );

    // return 1 page's documents
    return page.data;
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
    return `BroadcastBoosterPayouts`;
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
   * This scheduler is registered to run **every 5 minutes** at the
   * **tenth second**.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @param   {string[]}            passedParams
   * @param   {BaseCommandOptions}  options
   * @returns {Promise<void>}
   */
  @Cron("10 */5 * * * *", { name: "payout:cronjobs:boost5:broadcast" })
  public async runAsScheduler(): Promise<void> {
    // prepares execution logger
    this.logger.setModule(`${this.scope}/${this.command}`);

    // display starting moment information also in non-debug mode
    this.debugLog(`Starting payout broadcast for boosters`);

    // executes the actual command logic (this will call execute())
    await this.run([this.collection], {
      maxCount: 3, // <-- MAXIMUM 3 BROADCASTS per round
      debug: true,
    } as BroadcastBoosterPayoutsCommandOptions);
  }
}
