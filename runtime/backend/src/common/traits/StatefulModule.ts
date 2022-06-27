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
import { Logger } from "@nestjs/common";

// internal dependencies
import { StateService } from "../services/StateService";
import { State, StateQuery } from "../models/StateSchema";

/**
 * @abstract
 * @class StatefulModule
 * @description This concern requires the presence of fields that
 * consist in delivering *module-able* information or information
 * that is scoped/focussed in several submodules.
 *
 * @since v0.1.0
 */
export abstract class StatefulModule {
  /**
   * Requires state information of the module. This object is typically
   * *populated* upon first execution and *updated* any time later.
   *
   * @see StateService
   * @access protected
   * @var {State}
   */
  protected state: State;

  /**
   * This property permits to log information to the console or in files
   * depending on the configuration. This logger instance can be accessed
   * by extending modules to use a common log process.
   *
   * @access protected
   * @var {Logger}
   */
  protected logger: Logger;

  /**
   * Constructs a stateful module. This naming refers to a *nest* injectable
   * service *that is populated with state data* at runtime.
   * <br /><br />
   * The {@link StateService} is used internally to execute mongo database
   * queries against the `states` collection.
   *
   * @param   {StateService}    stateService
   */
  public constructor(
    protected readonly stateService: StateService,
  ) {}

  /**
   * Creates a **state query** for this discovery service. Each
   * discovery service shall set its own {@link stateIdentifier}
   * which is considered the identifier of the discovery module's
   * state document.
   *
   * @returns {StateQuery}
   */
  protected getStateQuery(): StateQuery {
    return new StateQuery(undefined, this.stateIdentifier);
  }

  /**
   * This method uses the {@link logger} to print debug messages.
   *
   * @param   {string}              message
   * @param   {string|undefined}    context
   * @returns {void}
   */
  protected debugLog(
    message: string,
    context?: string,
  ): void {
    return this.logger.debug(message, context);
  }

  /**
   * This method uses the {@link logger} to print error messages.
   * Optionally, a `stack` can be passed to print a stack trace.
   *
   * @param   {string}              message
   * @param   {string|undefined}    stack
   * @param   {string|undefined}    context
   * @returns {void}
   */
  protected errorLog(
    message: string,
    stack?: string,
    context?: string,
  ): void {
    return this.logger.error(message, stack, context);
  }

  /**
   * Getter for the discovery state identifier, e.g.
   * "discovery.accounts", "discovery.transactions",
   * "payout.outputs" etc.
   * <br /><br />
   * This method must be implemented by extended classes
   * to create the correct state query for this discovery
   * service.
   *
   * @abstract
   * @access protected
   * @var {string}
   */
  public abstract get stateIdentifier(): string;
}
