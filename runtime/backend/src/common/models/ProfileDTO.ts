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
import { ApiProperty } from "@nestjs/swagger";

// internal dependencies
import { AccountDTO } from "./AccountDTO";

/**
 * @class AccountDTO
 * @description A DTO class that consists of the *transferable* properties
 * of an account. Typically this includes information *that is already made
 * public* or is known from dHealth Network.
 * <br /><br />
 * This class shall be used in **HTTP responses** to avoid any additional
 * data about accounts to be revealed.
 *
 * @todo The transaction timestamp in `firstTransactionAt` should probably be a **number** to avoid timezone issues.
 * @since v0.1.0
 */
export class ProfileDTO extends AccountDTO {
  /**
   * This property stores list of
   * user integrated providers
   *
   * @access public
   * @var {any}
   */
  @ApiProperty({
    example: "['strava']",
    description: "List of integrations of current account",
  })
  public integrations: any;
}
