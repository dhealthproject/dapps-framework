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
import { Option } from "nest-commander";
import { PublicAccount, Address, NetworkType } from "@dhealth/sdk";

// internal dependencies
import { Scope } from "../../common/models/Scope";
import { BaseCommand, BaseCommandOptions } from "../../worker/BaseCommand";

/**
 * @interface DiscoveryCommandOptions
 * @description This interface defines **arguments** that can be
 * passed to any **discovery** command that is implemented in the
 * backend runtime.
 * <br /><br />
 * Note that it is important that child classes extend this interface
 * with their own specification of arguments.
 *
 * @see BaseCommandOptions
 * @since v0.2.0
 */
 export interface DiscoveryCommandOptions extends BaseCommandOptions {
  /**
   * Defines the discovery source for said discovery command. This
   * is usually a dHealth Account Public Key in hexadecimal format
   * or a dHealth Account Address.
   *
   * @access public
   * @var {string}
   */
  source: string;

  /**
   * Defines whether *unconfirmed* transactions must be included in
   * the resulting transaction page(s).
   *
   * @access public
   * @var {boolean}
   */
  includeUnconfirmed?: boolean;

  /**
   * Defines whether *partial* transactions must be included in
   * the resulting transaction page(s).
   *
   * @access public
   * @var {boolean}
   */
  includePartial?: boolean
}

/**
 * @class DiscoveryCommand
 * @description This class defines the abstraction layer used in
 * *any* discovery commands. Note that discovery commands are always
 * stateful modules due to the extension of {@link StatefulModule}
 * in the parent class {@link BaseCommand}.
 * <br /><br />
 * Additionally, discovery command also *implement* the `CommandRunner`
 * interface from `nest-commander`. The `run()` method call is defined
 * in {@link BaseCommand} and *delegates* the runtime to the method
 * implemented in this class as {@link runWithOptions}.
 *
 * @abstract
 * @since v0.2.0
 */
export abstract class DiscoveryCommand extends BaseCommand {
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
  protected scope: Scope = "discovery";

  /**
   * The discovery source. In most cases this will be the host
   * dapp's main account public key.
   *
   * @access protected
   * @var {Address}
   */
  protected discoverySource: Address;

  /**
   * This method must be implemented by extending classes and
   * should discover relevant subjects for this module.
   *
   * @abstract
   * @access public
   * @async
   * @param   {DiscoveryCommandOptions}   options
   * @returns {Promise<void>}
   */
  public abstract discover(options?: DiscoveryCommandOptions): Promise<void>;

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
   * e.g. "command <argument> [--option value]"
   *
   * @abstract
   * @access protected
   * @returns {string}
   */
  protected abstract get signature(): string;

  /**
   * This helper method serves as a *parser* for the `-s`
   * or `--source` option of this command.
   * <br /><br />
   * The discovery source can contain either of a public
   * key or an address, that will be parsed into {@link discoverySource}.
   *
   * @param     {string}  sourceOption     The sourceArgument as passed in the terminal.
   * @returns   {Address}   A parsed dHealth Account Address.
   */
  @Option({
    flags: '-s, --source <source>',
    description: 'Defines the discovery source for this command',
    required: true,
  })
  protected parseSource(sourceOption: string): Address {
    // extracts the network type from configuration
    const { networkIdentifier } = this.networkConfig.network;
    const networkType = networkIdentifier as NetworkType;

    // if we have a public key (64 characters in hexadecimal format)
    if (sourceOption.length === 64) {
      return PublicAccount.createFromPublicKey(
        sourceOption,
        networkType,
      ).address; // public-key to address
    }

    // otherwise *assume* we have an address (and remove hyphens if any)
    return Address.createFromRawAddress(sourceOption.replace(/\-/g, ''));
  }

  /**
   * This helper method serves as a *parser* for the `-u`
   * or `--include-unconfirmed` option of this command.
   *
   * @param     {string}  unconfirmedOption     The unconfirmedOption as passed in the terminal.
   * @returns   {boolean}   A boolean value that determines if unconfirmed transactions are included or not.
   */
  @Option({
    flags: '-u, --include-unconfirmed',
    description: 'Defines whether the discovery should include unconfirmed transactions'
  })
  protected parseUnconfirmedFlag(unconfirmedOption: string): boolean {
    return !!unconfirmedOption;
  }

  /**
   * This helper method serves as a *parser* for the `-p`
   * or `--include-partial` option of this command.
   *
   * @param     {string}  partialOption     The partialOption as passed in the terminal.
   * @returns   {boolean}   A boolean value that determines if unconfirmed transactions are included or not.
   */
  @Option({
    flags: '-p, --include-partial',
    description: 'Defines whether the discovery should include partial transactions (aggregate bonded)'
  })
  protected parsePartialFlag(partialOption: string): boolean {
    return !!partialOption;
  }

  /**
   * This method implements the *execution* logic for
   * discovery commands that extend this class. Child
   * classes must implement a {@link discover} method
   * that is called.
   * <br /><br />
   * Note that this method is called by {@link BaseCommand}.
   *
   * @see BaseCommand
   * @param {DiscoveryCommandOptions}  options   The *parsed* runtime arguments passed to the command.
   * @returns {Promise<void>}
   */
  protected async runWithOptions(
    options: DiscoveryCommandOptions,
  ): Promise<void> {

    // explicitely parsing here because of compatibility with
    // either of public keys and addresses in string format
    if (options.source && options.source.length) {
      this.discoverySource = this.parseSource(options.source);
    }

    // try-catch block around runWithOptions call make it
    // unnecessary here. Possibly this will change with some
    // commands that require more detailed error handling
    await this.discover(options);
  }
}
