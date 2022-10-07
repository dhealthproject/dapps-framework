/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

/**
 * This method formats your path to /assets folder
 * Usage example: getImageUrl("settings.svg")
 *
 * @access public
 */
export default {
  install(Vue: any) {
    Vue.prototype.getImageUrl = (path: string) => {
      return require("../assets/" + path);
    };
  },
};
