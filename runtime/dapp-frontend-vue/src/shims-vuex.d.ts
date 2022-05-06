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
// use of a `$store` property on class components. As we use
// Typescript class components, a property can only be referred
// to, if it was defined before. This shim defines the `$store`
// property and types it accordingly for *all* components.
/* eslint-disable */
import Store from "./state/store";
declare module "@vue/runtime-core" {
  interface ComponentCustomProperties {
    $store: Store;
  }
}
