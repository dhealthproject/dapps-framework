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
import { BaseEvent } from "./BaseEvent";

/**
 *
 */
export abstract class BaseEventListener {
  /**
   * This property permits to log information to the console or in files
   * depending on the configuration. This logger instance can be accessed
   * by extending listeners to use a common log process.
   *
   * @access protected
   * @var {Logger}
   */
  protected logger: Logger;

  /**
   * The application scope that includes this *listener* implementation,
   * e.g. `"payout"`.
   *
   * @access protected
   * @var {string}
   */
  protected scope: string;

  /**
   * The class name of the event that is being listened to by this listener,
   * e.g. `"OnActivityCreated"`.
   *
   * @access protected
   * @var {string}
   */
  protected eventName: string;

  /**
   * Constructs an instance of a base listener.
   *
   * @access public
   * @param   {string}    scope         The application scope that includes this *listener* implementation.
   * @param   {string}    eventName     The class name of the event that is being listened to by this listener.
   */
  public constructor(scope: string, eventName: string) {
    this.scope = scope;
    this.eventName = eventName;

    // initializes a logger with correct name
    this.logger = new Logger(`${this.scope}/${this.eventName}`);
  }

  /**
   * This method signatures serves as a base definition for
   * application-level event listeners. All child classes must
   * overload this method with their own implementation.
   *
   * @access public
   * @abstract
   * @param   {BaseEvent}   event
   * @returns {Promise<void>}
   */
  public abstract handleEvent(event: BaseEvent): Promise<void>;

  /**
   * This method uses the {@link logger} to print debug messages.
   *
   * @param   {string}              message
   * @param   {string|undefined}    context
   * @returns {void}
   */
  protected debugLog(message: string, context?: string): void {
    if (!!context) {
      this.logger.debug(message, context);
    } else this.logger.debug(message);
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
  protected errorLog(message: string, stack?: string, context?: string): void {
    this.logger.error(message, stack, context);
  }
}
