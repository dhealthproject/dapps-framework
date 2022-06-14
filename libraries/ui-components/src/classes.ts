/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Documentation
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// This file is necessary to permit a cleaner automatic
// generation of a reference documentation. The library
// exports using `components.ts` and `index.ts` are far
// more verbose and less readable.

// Note: Any component released as part of this library
// **must** be exported in this file using a reference
// to the TypeScript class for `typedoc` to succeed.

// library types
import type { Variant } from "./types/Variant";

// components
import DappButton from "./controls/DappButton/DappButton";
import DappQR from "./widgets/DappQR/DappQR";
import DappTokenAmount from "./fields/DappTokenAmount/DappTokenAmount";
import DappIcon from "./graphics/DappIcon/DappIcon";

// exports
export type { Variant };
export { DappButton, DappQR, DappTokenAmount, DappIcon };
