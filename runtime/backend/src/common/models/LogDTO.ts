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
import { BaseDTO } from "./BaseDTO";

/**
 * @class LogDTO
 * @description A DTO class that consists of the *transferable* properties
 * of a log.
 *
 * @since v0.3.2
 */
export class LogDTO extends BaseDTO {
  /**
   * The timestamp in which the log occurred and was persisted.
   *
   * @access public
   * @var {Date}
   */
  public timestamp: Date;

  /**
   * The level of the log.
   *
   * @example `"log"`
   * @access public
   * @see LogLevel
   * @var {LogLevel}
   */
  public level: LogLevel;

  /**
   * The message content of the log.
   *
   * @example `"Log message content"`
   * @access public
   * @var {string}
   */
  public message: string;

  /**
   * The meta object content of the log.
   *
   * @example `{context: "context", stack: ["stack message"], timestamp: "2022-11-01T16:15:14.312Z"}`
   * @access public
   * @var {object}
   */
  public meta: object;

  /**
   * The label content of the log.
   *
   * @example `"statistics/LeaderboardAggregation/W"`
   * @access public
   * @var {string}
   */
  public label: string;
}
