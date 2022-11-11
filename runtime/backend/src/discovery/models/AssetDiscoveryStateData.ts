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
 * @class AssetDiscoveryStateData
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
export class AssetDiscoveryStateData implements StateData {
  /**
   * Contains the *address* of the last account that was used
   * in the *transaction* discovery. This is used in the case
   * of runtime configuration that contains **more than one**
   * discovery source and permits to track multiple accounts
   * sequentially.
   *
   * @access public
   * @var {string}
   */
  public lastUsedAccount: string;

  /**
   * Contains the timestamp of the last execution of the
   * accounts discovery command.
   *
   * @access public
   * @var {number}
   */
  public lastExecutedAt: number;
}
