/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

type Format = "dots" | "dashes";

/**
 * This method formats your address to
 * NMWID...123
 * or
 * NMWID-123
 *
 * By the default format is dots
 *
 * @access public
 */
export default {
  install(Vue: any) {
    Vue.prototype.formatAddress = (value: string, format: Format = "dots") => {
      if (!value) return;
      const splittedAddress = value.split("-");
      const currentFormat = format === "dots" ? "..." : "-";
      let firstSix: string;
      let lastThree: string;

      // If address length is 1 - address was provided without the dashes
      // If so - get first 6 symbols and last 3

      // else - get first-last elements of an array
      // return value due to format
      if (splittedAddress.length === 1) {
        firstSix = value.slice(0, 6);
        lastThree = value.slice(value.length - 4, value.length - 1);
      } else {
        firstSix = splittedAddress[0];
        lastThree = splittedAddress[splittedAddress.length - 1];
      }

      return `${firstSix}${currentFormat}${lastThree}`;
    };
  },
};
