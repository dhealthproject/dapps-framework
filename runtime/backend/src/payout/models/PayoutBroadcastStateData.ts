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
import type { StateData } from "../../common/models/StateData";

/**
 * @class PayoutBroadcastStateData
 * @description A type that represents data about the
 * state of the **processor** module. Note that we
 * implement the {@link StateData} type to permit more
 * flexibility on gathering module states.
 * <br /><br />
 * This class shall be used mainly to refer and handle
 * data in relation with the **processor** module.
 *
 * @see PreparePayouts
 * @since v0.4.0
 */
export class PayoutBroadcastStateData implements StateData {
  /**
   * Contains the timestamp of the last execution of the
   * payout broadcast command.
   *
   * @access public
   * @var {number}
   */
  public lastExecutedAt: number;
}
