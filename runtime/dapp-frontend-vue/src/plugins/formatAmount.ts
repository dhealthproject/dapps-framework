/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

// Will be used if future
// type Symbol = "dhp" | "fit";

/**
 * This method formats provided value
 * based on provided divisibility
 *
 * so to get 2.37 FIT we're doing
 * 237 / Math.pow(10, 2) = 2.37
 *
 * By the default format is dots
 *
 * @access public
 */
export default {
  install(Vue: any) {
    Vue.prototype.formatAmount = function (
      amount: number,
      divisibility: number | undefined = undefined
    ) {
      const config = this.$store.getters["app/getConfig"];
      const defaultDigits = config.digitsAmount;
      return amount / Math.pow(10, divisibility ?? defaultDigits);
    };
  },
};
