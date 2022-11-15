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
 * @class UserAggregationStateData
 * @description A type that represents data about the
 * state of the **user aggregation** module. Note that we
 * implement the {@link StateData} type to permit more
 * flexibility on gathering module states.
 * <br /><br />
 * This class shall be used mainly to refer and handle
 * data in relation with the **discovery** module.
 *
 * @see UserAggregation
 * @since v0.3.2
 */
export class UserAggregationStateData implements StateData {
  /**
   * Contains the timestamp of the last execution of the
   * blocks discovery command.
   *
   * @access public
   * @var {number}
   */
  public lastExecutedAt: number;
}
