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
import DappTitle from "./texts/DappTitle/DappTitle";
import DappDate from "./fields/DappDate/DappDate";
import DappMessage from "./fields/DappMessage/DappMessage";
import DappAccountAvatar from "./graphics/DappAccountAvatar/DappAccountAvatar";
import DappAccountCard from "./widgets/DappAccountCard/DappAccountCard";
import DappMessageCircle from "./graphics/DappMessageCircle/DappMessageCircle";
import DappMosaicCircle from "./graphics/DappMosaicCircle/DappMosaicCircle";
import DappNamespaceCircle from "./graphics/DappNamespaceCircle/DappNamespaceCircle";
import DappNamespaceUnlinkCircle from "./graphics/DappNamespaceUnlinkCircle/DappNamespaceUnlinkCircle";
import DappTransactionArrow from "./graphics/DappTransactionArrow/DappTransactionArrow";
import DappTransferTransaction from "./transaction-graphics/DappTransferTransaction/DappTransferTransaction";
import DappUnknownTransaction from "./transaction-graphics/DappUnknownTransaction/DappUnknownTransaction";
import DappAbstractTransaction from "./transaction-graphics/DappAbstractTransaction/DappAbstractTransaction";
import DappTransactionGraphic from "./widgets/DappTransactionGraphic/DappTransactionGraphic";
import DappAddressAliasTransaction from "./transaction-graphics/DappAddressAliasTransaction/DappAddressAliasTransaction";

// exports
export type { Variant };
export {
  DappButton,
  DappDate,
  DappIcon,
  DappMessage,
  DappQR,
  DappTitle,
  DappTokenAmount,
  DappAccountAvatar,
  DappAccountCard,
  DappMessageCircle,
  DappMosaicCircle,
  DappNamespaceCircle,
  DappNamespaceUnlinkCircle,
  DappTransactionArrow,
  DappTransferTransaction,
  DappUnknownTransaction,
  DappAbstractTransaction,
  DappTransactionGraphic,
  DappAddressAliasTransaction,
};
