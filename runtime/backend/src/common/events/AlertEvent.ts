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
import { LogLevel } from "@nestjs/common";

// internal dependencies
import { BaseEvent } from "./BaseEvent";

/**
 * @label EVENTS
 * @class AlertEvent
 * @description An event class that is attached to *emitted events* as a payload
 * for events with the name `event.log.warn` and `event.log.error`.
 * <br /><br />
 * This class can also be used to implement the event emitter.
 * <br /><br />
 * Parameters:
 * | Name | Type | Description |
 * | --- | --- | --- |
 * | `timestamp`     | `Date`   | The timestamp in which the event occurred. |
 * | `level`         | `string` | The level of the event's log. |
 * | `loggerContext` | `string` | The logger context of the event's log. |
 * | `message`       | `string` | The message of the event's log. |
 * | `trace`         | `string` | The trace (stack) of the log if the log is at `error` level. |
 * | `context`       | `string` | The context of the event's log. |
 *
 * @since v0.3.2
 */
export class AlertEvent extends BaseEvent {
  timestamp?: Date;
  level?: LogLevel;
  loggerContext?: string;
  message?: string;
  trace?: string;
  context?: string;

  /**
   * Static method to create and return
   * a new instance of this class based
   * on the required inputs.
   *
   * @access public
   * @static
   * @param {Date} timestamp
   * @param {LogLevel} level
   * @param {string} loggerContext
   * @param {string} message
   * @param {string} trace
   * @param {string} context
   * @returns {AlertEvent}
   */
  static create(
    timestamp: Date,
    level: LogLevel,
    loggerContext: string,
    message: string,
    trace?: string,
    context?: string,
  ): AlertEvent {
    const result = new AlertEvent();
    if (timestamp) result.timestamp = timestamp;
    if (level) result.level = level;
    if (loggerContext) result.loggerContext = loggerContext;
    if (message) result.message = message;
    if (trace) result.trace = trace;
    if (context) result.context = context;
    return result;
  }
}
