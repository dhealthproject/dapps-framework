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
 * @class User
 * @description This interface provides *requirements* for users
 * that can authenticate to a dApp.
 *
 * @since v0.2.0
 */
export interface User {
  /**
   * Contains the dHealth account address of this end-user entry
   * that is used as the *identifier*.
   * <br /><br />
   * Note that in this current draft implementation, the {@link name}
   * property holds the same value.
   *
   * @access public
   * @var {string}
   */
  id: string;

  /**
   * Contains the dHealth account address of this end-user entry
   * that is used as the *identifier*.
   * <br /><br />
   * Note that in this current draft implementation, the {@link id}
   * property holds the same value.
   *
   * @access public
   * @var {string}
   */
  name: string;
}
