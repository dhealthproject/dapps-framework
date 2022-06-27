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
import { CommandRunner, Help } from 'nest-commander';
import { Logger } from "@nestjs/common";

// internal dependencies
import { StateService } from "../common/services/StateService";
import { StatefulModule } from "../common/traits/StatefulModule";
import { Scope } from "../common/models/Scope";
import { DappConfig } from '../common/models/DappConfig';
import { NetworkConfig } from '../common/models/NetworkConfig';

// configuration resources
import dappConfigLoader from "../../config/dapp";
import networkConfigLoader from "../../config/network";

/**
 * @interface BaseCommandOptions
 * @description This interface defines **arguments** that can be
 * passed to *any* command that is implemented in the backend
 * runtime.
 * <br /><br />
 * Note that it is important that child classes extend this interface
 * with their own specification of arguments.
 *
 * @since v0.2.0
 */
export interface BaseCommandOptions {
  /**
   * Whether **debug** must be enabled. Enabling this argument
   * will display log messages for **all modes** (including mode
   * `debug`).
   * <br /><br />
   * When this argument is enabled, it is possible that many logs
   * will be printed to the terminal/shell during runtime.
   *
   * @access public
   * @var {boolean}
   */
  debug?: boolean;

  /**
   * Whether **quiet** must be enabled. Enabling this argument
   * will display **no log messages at all** except for **errors**.
   * <br /><br />
   * When this argument is enabled, the runtime will not produce
   * *any logs* outside of errors.
   *
   * @access public
   * @var {boolean}
   */
  quiet?: boolean;
}

/**
 * @class BaseCommand
 * @description The abstract definition of a command line script
 * that the backend runtime can execute. Commands refer to routines
 * that handle scoped business layer logic and that may or may not
 * run on a separate process in the background.
 * <br /><br />
 * Note that cronjobs, for example, should always use commands to
 * execute their business logic as this permits to further augment
 * the access to cronjobs for the team.
 *
 * @since v0.2.0
 */
export abstract class BaseCommand
  extends StatefulModule
  implements CommandRunner
{
  /**
   * The command scope. This is the scope that must be enabled
   * through the configuration files for this command to be
   * available.
   * <br /><br />
   * Child classes *must* overwrite the value of this property.
   *
   * @access protected
   * @var {Scope}
   */
  protected scope: Scope = "worker";

  /**
   * The arguments passed to the command. Typically, this holds
   * required parameters of commands.
   *
   * @access protected
   * @var {string[]}
   */
  protected argv: string[] = [];

  /**
   * The internal dApp configuration object. This object is used
   * to configure key functionalities such as the name of a dApp
   * and the **enabled scopes** of the backend runtime.
   *
   * @access protected
   * @var {NetworkConfig}
   */
  protected dappConfig: DappConfig;

  /**
   * The internal dApp *network* configuration object. This object
   * is used to configure the access to the underlying blockchain
   * network.
   *
   * @access protected
   * @var {NetworkConfig}
   */
  protected networkConfig: NetworkConfig;

  /**
   * Constructs an instance of this command. This constructor
   * initializes a logger instance with the {@link scope} and
   * {@link name} of the command.
   *
   * @access public
   */
  public constructor(
    protected readonly stateService: StateService,
  ) {
    super(stateService);
    this.dappConfig = dappConfigLoader();
    this.networkConfig = networkConfigLoader();
  }

  /**
   * Getter for the discovery state identifier, e.g.
   * "discovery.accounts", "discovery.transactions",
   * "payout.outputs" etc.
   * <br /><br />
   * This method is an implementation necessary because
   * of the extensions of {@link StatefulModule}.
   *
   * @see StatefulModule
   * @access public
   * @var {string}
   */
  public get stateIdentifier(): string {
    return `${this.scope}:${this.command}`;
  }

  /**
   * This method prints *usage information* to the command line
   * and is used by `nest-commander` to print a correctly formatted
   * help message.
   * <br /><br />
   * Note that usage methods can be overwritten but must always
   * print a standard command line **signature**.
   *
   * @access public
   * @returns {string}
   */
  @Help("before")
  public usage(): string {
    // prints the command signature
    return `${this.signature}`;
  }

  /**
   * This method is the **entry point** of any command line
   * executed command. `nest-commander` implements a flow
   * where this method is called with parameters that are
   * respectively the *raw arguments* and the *parsed arguments*
   * to this command call.
   *
   * @access public
   * @param   {string[]}            passedParams  
   * @param   {BaseCommandOptions}  options 
   * @returns {Promise<void>}
   */
  public async run(
    passedParams: string[],
    options?: BaseCommandOptions,
  ): Promise<void> {
    // prepares execution logger and arguments
    this.logger = new Logger(`${this.command}`);
    this.argv = passedParams;

    // display debug info about arguments and options
    if (options.debug && !options.quiet) {
      this.debugLog(`Initializing command "${this.command}"...`);
      if (passedParams.length) this.debugLog(
        `Arguments received: ["${passedParams.join("\", \"")}"]`
      );
      if (options !== undefined) this.debugLog(
        `Options received: ${JSON.stringify(options, null, 2)}`
      );
    }

    // tracks starting moment
    const startTime = new Date().getTime();

    // this try-catch block makes sure that no exception can happen
    // on production as the consequence of running a command, that
    // would not get caught by the error handler.
    try {
      // synchronize the execution state ("be stateful")
      this.state = await this.stateService.findOne(this.getStateQuery());

      // displays state debug information
      if (options.debug && !options.quiet) {
        this.debugLog(`Current state: ${JSON.stringify(this.state, null, 2)}`);
      }

      // delegate method execution to child classes
      // note that this operation may be blocking
      await this.runWithOptions(options);
    }
    catch (e: any) {
      // @todo Should provide failures stacktrace + database copy
      this.errorLog(
        undefined !== e && 'message' in e ? e.message : e,
        undefined !== e && 'stack' in e ? e.stack : undefined,
      );
    }

    // tracks ending moment
    const endTime = new Date().getTime();

    // display debug info about total duration
    if (options.debug && !options.quiet) {
      this.debugLog(`Runtime duration: ${(endTime - startTime) / 1000}s`);
    }

    // no-return (void)
  }

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "scope:name"
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
   * e.g. "command <required-argument> [--option value]"
   *
   * @abstract
   * @access protected
   * @returns {string}
   */
  protected abstract get signature(): string;

  /**
   * This method must implement the actual business logic
   * of the command being developed. Classes that extend
   * this command base class *must* implement this method
   * as it represents the **entry point** of command line
   * executed commands.
   * <br /><br />
   * Note that with each command comes their own command
   * line *arguments*, these must be correctly typed and
   * must *augment* the {@link BaseCommandOptions} interface.
   *
   * @abstract
   * @param {BaseCommandOptions}  options   The *parsed* runtime arguments passed to the command.
   * @returns {Promise<void>}
   */
  protected abstract runWithOptions(
    options: BaseCommandOptions,
  ): Promise<void>;
}
