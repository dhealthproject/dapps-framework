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
export abstract class BroadcastBoosterPayouts extends BroadcastPayouts<
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
   * Memory store for the *booster asset configuration* object. This
   * object defines which assets are *discoverable* on dHealth Network
   * and used to *tokenize a particular booster operation*.
   * <br /><br />
   * This asset configuration is referred to as a **booster asset**
   * used in a specific dApp.
   *
   * @access protected
   * @abstract
   * @var {AssetParameters}
   */
  protected abstract get boosterAsset(): AssetParameters;

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
}
