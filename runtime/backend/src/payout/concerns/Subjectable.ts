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
import { Documentable } from "../../common/concerns/Documentable";
import { PayoutState } from "../models/PayoutStatusDTO";

/**
 * @label PAYOUT
 * @interface Subjectable
 * @description This concern requires the presence of fields that
 * consist in delivering information about the subject of a payout.
 *
 * @since v0.4.0
 */
export class Subjectable extends Documentable {
  /**
   * This is the subject slug. With the currently implemented
   * payout module, the subject is *always* an activity but in
   * future releases of the software, the subject may also be
   * a *profile*, or a *leaderboard update*, etc.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  public readonly slug: string;

  /**
   * The account's **address**. An address typically refers to a
   * human-readable series of 39 characters, starting either with
   * a `T`, for TESTNET addresses, or with a `N`, for MAINNET addresses.
   *
   * @access public
   * @readonly
   * @var {string}
   */
  public readonly address: string;

  /**
   * This property is a flag that determines whether the subject payout
   * has been executed. An subject is considered to be *completed* only
   * *after* the payout has been *confirmed* on dHealth Network.
   * <br /><br />
   * Possible values for this field in the database are of type `number` and
   * listed in {@link PayoutState}. Initially, the value will always be
   * `0` as this corresponds to "not-started".
   *
   * @access public
   * @readonly
   * @var {PayoutState}
   */
  public readonly payoutState?: PayoutState;

  /**
   * Contains the creation date of the subject.
   *
   * @access public
   * @readonly
   * @var {Date}
   */
  public readonly createdAt?: Date;
}
