/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// This shim is necessary to permit TypeScript import
// of *.vue files directly. These files may or may not
// contain Typescript source code.
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}
