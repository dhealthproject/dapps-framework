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
import {
  Account,
  AccountDocument,
  AccountModel,
} from "../../../common/models/AccountSchema";
import { AssetParameters } from "../../../common/models/AssetsConfig";

// discovery scope
import { AssetsService } from "../../../discovery/services/AssetsService";

// payout scope
import { PayoutsService } from "../../services/PayoutsService";
import { SignerService } from "../../services/SignerService";
import { MathService } from "../../services/MathService";
import { PayoutCommand, PayoutCommandOptions } from "../PayoutCommand";
import {
  PrepareBoosterPayouts,
  PrepareBoosterPayoutsCommandOptions,
} from "./PrepareBoosterPayouts";

/**
 * @interface PrepareBoost10PayoutsCommandOptions
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
export type PrepareBoost10PayoutsCommandOptions =
  PrepareBoosterPayoutsCommandOptions;

/**
 * @label PAYOUT
 * @class PrepareBoost10Payouts
 * @description The implementation for the payout *preparation*
 * scheduler. Contains source code for the execution logic of a
 * command with name: `processor:PrepareBoost10Payouts`.
 * <br /><br />
 * Notably, this command *fetches accounts* that have not been
 * the subject of payouts yet and then *creates transactions* and
 * *signs transactions*.
 *
 * @since v0.4.0
 */
@Injectable()
export class PrepareBoost10Payouts extends PrepareBoosterPayouts {
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
      assetsService,
      mathService,
      model,
    );

    this.boosterAsset = this.configService.get<AssetParameters>(
      "boosters.referral.boost10",
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
    return `PrepareBoost10Payouts`;
  }

  /**
   * Memory story for the *minimum count of referrals* that were
   * confirmed for a user.
   * <br /><br />
   * The referral progress bars fills 5 steps for each level. There
   * is a maximum of 3 levels.
   * <br /><br />
   * This referral progress badge can be obtained by referring a total
   * of `50` other accounts.
   *
   * @access protected
   * @abstract
   * @returns {number}
   */
  protected get minReferred(): number {
    return 50;
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
   * This scheduler is registered to run **every 5 minutes**.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @param   {string[]}            passedParams
   * @param   {BaseCommandOptions}  options
   * @returns {Promise<void>}
   */
  @Cron("0 */5 * * * *", { name: "payout:cronjobs:boost10:prepare" })
  public async runAsScheduler(): Promise<void> {
    // prepares execution logger
    this.logger.setModule(`${this.scope}/${this.command}`);

    // display starting moment information also in non-debug mode
    this.debugLog(`Starting payout preparation for booster type: boost10`);

    // display debug information about total number of transactions
    this.debugLog(
      `Total number of boost10 payouts prepared: "${this.totalNumberPrepared}"`,
    );

    // executes the actual command logic (this will call execute())
    await this.run([this.collection], {
      debug: false,
    } as PayoutCommandOptions);
  }
}
