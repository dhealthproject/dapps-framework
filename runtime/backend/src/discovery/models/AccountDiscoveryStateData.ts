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
 * @class AccountDiscoveryStateData
 * @description A type that represents data about the
 * state of the **discovery** module. Note that we
 * implement the {@link StateData} type to permit more
 * flexibility on gathering module states.
 * <br /><br />
 * This class shall be used mainly to refer and handle
 * data in relation with the **discovery** module.
 *
 * @see DiscoverAccounts
 * @since v0.1.0
 */
export class AccountDiscoveryStateData implements StateData {
  /**
   * Contains the last page number that was used in the
   * transactions database query. Since accounts are all
   * discovery from transactions, we only need to read a
   * transaction once to discover the involved address(es).
   *
   * @access public
   * @var {number}
   */
  public lastPageNumber: number;

  /**
   * Contains the timestamp of the last execution of the
   * accounts discovery command.
   *
   * @access public
   * @var {number}
   */
  public lastExecutedAt: number;
}
