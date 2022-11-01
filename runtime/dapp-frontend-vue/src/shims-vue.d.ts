/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// This shim type declaration file is necessary to permit the
// use of `.vue` file extensions that export a class component
// using the `default` export. The `defineComponent` import is
// necessary since Vue's v3 and we hereby *require* its use for
// the entire software's `.vue` files that potentially register
// components, mixins or plugins on top of vue.
/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vueperslides" {
  class VueperSlides extends DefineComponent {}
  class VueperSlide extends DefineComponent {}
}

declare module "@dhealth/components";
