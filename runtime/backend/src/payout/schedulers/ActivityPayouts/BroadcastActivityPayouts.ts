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
import { Cron } from "@nestjs/schedule";

// internal dependencies
// common scope
import { NetworkService } from "../../../common/services/NetworkService";
import { StateService } from "../../../common/services/StateService";

// payout scope
import {
  BroadcastPayouts,
  BroadcastPayoutsCommandOptions,
} from "../BroadcastPayouts";
import { PayoutCommand, PayoutCommandOptions } from "../PayoutCommand";
import { PayoutDocument, PayoutQuery } from "../../models/PayoutSchema";
import { PayoutState } from "../../models/PayoutStatusDTO";
import { PayoutsService } from "../../services/PayoutsService";
import { SignerService } from "../../services/SignerService";

/**
 * @interface BroadcastActivityPayoutsCommandOptions
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
export type BroadcastActivityPayoutsCommandOptions =
  BroadcastPayoutsCommandOptions;

/**
 * @class BroadcastActivityPayouts
 * @description The implementation for the payout *preparation*
 * scheduler. Contains source code for the execution logic of a
 * command with name: `processor:BroadcastActivityPayouts`.
 * <br /><br />
 * Notably, this command *fetches activities* that have not been
 * the subject of payouts yet and then *creates transactions* and
 * *signs transactions*.
 *
 * @since v0.4.0
 */
@Injectable()
export class BroadcastActivityPayouts extends BroadcastPayouts {
  /**
   * Constructs and prepares an instance of this scheduler.
   *
   * @param {ConfigService}   configService
   * @param {StateService}    stateService
   * @param {PayoutsService}  payoutsService
   * @param {SignerService}   signerService
   * @param {NetworkService}  networkService
   */
  constructor(
    protected readonly configService: ConfigService,
    protected readonly stateService: StateService,
    protected readonly payoutsService: PayoutsService,
    protected readonly signerService: SignerService,
    protected readonly networkService: NetworkService,
  ) {
    // required super call
    super(
      configService,
      stateService,
      payoutsService,
      signerService,
      networkService,
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
    return `BroadcastActivityPayouts`;
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
   * This method must return an *array of subjects*. Note that
   * subjects *will be the subject of a payout execution*.
   *
   * @access protected
   * @async
   * @param   {number}    count     The count of subjects to retrieve.
   * @returns {Promise<PayoutDocument[]>}
   */
  protected async fetchSubjects(count: number): Promise<PayoutDocument[]> {
    // queries *one page* of 10 `activities` documents for which
    // the *processing state* is currently `Not_Processed` and
    // the *payout state* is currently `Not_Started`.
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
   * This method is the **entry point** of this scheduler. Due to
   * the usage of the `Cron` decorator, and the implementation
   * the nest backend runtime is able to discover this when the
   * `processor` scope is enabled.
   * <br /><br />
   * This method is necessary to make sure this command is run
   * with the correct `--signer` option.
   * <br /><br />
   * This scheduler is registered to run **every minute** at the
   * **fifth second**.
   *
   * @see BaseCommand
   * @access public
   * @async
   * @param   {string[]}            passedParams
   * @param   {BaseCommandOptions}  options
   * @returns {Promise<void>}
   */
  @Cron("5 */1 * * * *", { name: "payout:cronjobs:broadcast" })
  public async runAsScheduler(): Promise<void> {
    // prepares execution logger
    this.logger = new Logger(`${this.scope}/${this.command}`);

    // display starting moment information in debug mode
    this.debugLog(
      `Starting payout broadcast for subjects type: ${this.collection}`,
    );

    // executes the actual command logic (this will call execute())
    await this.run([this.collection], {
      maxCount: 3, // <-- MAXIMUM 3 BROADCASTS per round
      debug: true,
    } as BroadcastActivityPayoutsCommandOptions);
  }
}