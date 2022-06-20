/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import type { StateData } from "../../common/models/StateData";

/**
 * @class DiscoveryState
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
export class DiscoveryState implements StateData {
  /**
   * The transactions page that should be read during the
   * discovery process(es). This field is used to keep
   * track of the already *discovered* transactions pages.
   *
   * @access public
   * @var {number}
   */
  public currentTxPage: number;

  /**
   * The latest transaction hash that was *discovered* by
   * the discovery process(es). This field is used to keep
   * track of the already *discovered* transaction hashes.
   *
   * @access public
   * @var {string}
   */
  public latestTxHash: string;
}
