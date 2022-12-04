/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { Scope } from "../../common/models/Scope";
import { BaseCommand, BaseCommandOptions } from "../../worker/BaseCommand";

/**
 * @interface PayoutCommandOptions
 * @description This interface defines **arguments** that can be
 * passed to any **payout** command that is implemented in the
 * backend runtime.
 * <br /><br />
 * Note that it is important that child classes extend this interface
 * with their own specification of arguments.
 *
 * @see BaseCommandOptions
 * @since v0.4.0
 */
export interface PayoutCommandOptions extends BaseCommandOptions {
  /**
   * Defines whether the command is executed in "dry-mode" or not. In
   * dry-mode, commands *will not broadcast transactions*. Transactions
   * may still be *prepared*.
   *
   * @access public
   * @var {boolean}
   */
  dryRun: boolean;
}

/**
 * @class PayoutCommand
 * @description This class defines the abstraction layer used in
 * *any* payout commands. Note that payout commands are always
 * stateful modules due to the extension of {@link StatefulModule}
 * in the parent class {@link BaseCommand}.
 * <br /><br />
 * Additionally, payout commands also *implement* the `CommandRunner`
 * interface from `nest-commander`. The `run()` method call is defined
 * in {@link BaseCommand} and *delegates* the runtime to the method
 * implemented in this class as {@link runWithOptions}.
 *
 * @abstract
 * @since v0.4.0
 */
export abstract class PayoutCommand extends BaseCommand {
  /**
   * The command scope. This is the scope that must be enabled
   * through the configuration files for this command to be
   * available.
   * <br /><br />
   * This property is required through the extension of
   * {@link BaseCommand}.
   *
   * @access protected
   * @var {Scope}
   */
  protected scope: Scope = "payout";

  /**
   * This method must be implemented by extending classes and
   * should process relevant subjects for this module.
   *
   * @abstract
   * @access public
   * @async
   * @param   {PayoutCommandOptions}   options
   * @returns {Promise<void>}
   */
  public abstract execute(options?: PayoutCommandOptions): Promise<void>;

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "scope:name"
   * <br /><br />
   * This property is required through the extension of
   * {@link BaseCommand} but is intentionally forwarded
   * to further *child classes* such that **each command defines
   * its own command name**.
   *
   * @abstract
   * @access protected
   * @returns {string}
   */
  protected abstract get command(): string;

  /**
   * This method must return a *command signature* that
   * contains hints on the command name and its required
   * and optional arguments.
   * <br /><br />
   * e.g. "command <argument> [--option value]"
   * <br /><br />
   * This property is required through the extension of
   * {@link BaseCommand} but is intentionally forwarded
   * to further *child classes* such that **each command defines
   * its own command signature**.
   *
   * @abstract
   * @access protected
   * @returns {string}
   */
  protected abstract get signature(): string;

  /**
   * This method implements the *execution* logic for
   * processor commands that extend this class. Child
   * classes must implement a {@link process} method
   * that is called in here.
   * <br /><br />
   * Note that this method is called by {@link BaseCommand}
   * under the hood, which permits to execute and track
   * failures more consistently at a higher level.
   *
   * @see BaseCommand
   * @param {PayoutCommandOptions}  options   The *parsed* runtime arguments passed to the command.
   * @returns {Promise<void>}
   */
  protected async runWithOptions(options: PayoutCommandOptions): Promise<void> {
    // try-catch block around runWithOptions call make it
    // unnecessary here. Possibly this will change with some
    // commands that require more detailed error handling
    await this.execute(options);

    // no-return (void)
  }
}
