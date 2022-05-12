/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// This file is necessary to enable the installation of
// the library using built-in Vue (>= v2) software. This
// file makes sure that components are re-usable and are
// exported using named exports.

// Note: Any component released as part of this library
// **must** be exported using this file. A reference to
// the `.vue` file and the default export are imported.

// importing components
import TokenAmount from "./fields/TokenAmount/TokenAmount.vue";
import ActionButton from "./controls/ActionButton/ActionButton.vue";

// exports components as named-exports
export { ActionButton, TokenAmount };
