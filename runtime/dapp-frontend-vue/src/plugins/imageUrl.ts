/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

// import Vue from "vue";
// import VueType from "vue/types/umd";

export default {
  install(Vue: any, options: any) {
    Vue.prototype.getImageUrl = (path: string) => {
      return require("../assets/" + path);
    };
  },
};
