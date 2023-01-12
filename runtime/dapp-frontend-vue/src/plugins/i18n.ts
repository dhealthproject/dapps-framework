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
 * This method provides an access to all available i18n translations
 *
 * @access public
 */
export default {
  install(Vue: any) {
    Vue.prototype.$t = function (
      translationKey: string,
      parameters: any = {},
      customLanguage?: string | undefined
    ) {
      return this.$store.getters["app/i18n"].$t(
        translationKey,
        parameters,
        customLanguage
      );
    };
  },
};
