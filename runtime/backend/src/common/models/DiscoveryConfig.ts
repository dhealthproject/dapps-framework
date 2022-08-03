/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @interface DiscoveryConfig
 * @description This interface defines the required configuration of dApps
 * discovery operations. You can use this interface when referring to the
 * configuration that is necessary to run the **discovery scope** of this
 * backend.
 * <br /><br />
 * The {@link sources} field can hold an *array of account addresses* or
 * an *array of public keys*, you can also use both options together.
 * <br /><br />
 * Note that *each discovery source is synchronized separately*, as such
 * if there is more than one discovery source, the synchronization state
 * is effectively split amongst the separate sources and the backend may
 * take more time to complete the synchronization process.
 *
 * @since v0.3.0
 */
export interface DiscoveryConfig {
  /**
   * An array of discovery sources. This is typically an array
   * of account address and/or public keys.
   * <br /><br />
   * Discovery sources are used to fetch the data necessary to
   * synchronize the backend database with the network.
   *
   * @access public
   * @var {string[]}
   */
  sources: string[];
}
