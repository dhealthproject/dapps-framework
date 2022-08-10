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
import DappAccountAvatar from "./graphics/DappAccountAvatar/DappAccountAvatar";
import DappAccountCard from "./widgets/DappAccountCard/DappAccountCard";
import DappButton from "./controls/DappButton/DappButton";
import DappQR from "./widgets/DappQR/DappQR";
import DappTokenAmount from "./fields/DappTokenAmount/DappTokenAmount";
import DappIcon from "./graphics/DappIcon/DappIcon";
import DappInput from "./fields/DappInput/DappInput";
import DappTitle from "./texts/DappTitle/DappTitle";
import DappDate from "./fields/DappDate/DappDate";
import DappMessage from "./fields/DappMessage/DappMessage";
import DappMosaic from "./fields/DappMosaic/DappMosaic";
import DappMessageCircle from "./graphics/DappMessageCircle/DappMessageCircle";
import DappMosaicCircle from "./graphics/DappMosaicCircle/DappMosaicCircle";
import DappNamespaceCircle from "./graphics/DappNamespaceCircle/DappNamespaceCircle";
import DappNamespaceUnlinkCircle from "./graphics/DappNamespaceUnlinkCircle/DappNamespaceUnlinkCircle";
import DappAddCircle from "./graphics/DappAddCircle/DappAddCircle";
import DappEditCircle from "./graphics/DappEditCircle/DappEditCircle";
import DappTransactionArrow from "./graphics/DappTransactionArrow/DappTransactionArrow";
import DappUnknownTransaction from "./graphics/transactions/DappUnknownTransaction/DappUnknownTransaction";
import DappAbstractTransaction from "./graphics/transactions/DappAbstractTransaction/DappAbstractTransaction";
import DappTransactionGraphic from "./widgets/DappTransactionGraphic/DappTransactionGraphic";
import DappAddressAliasTransaction from "./graphics/transactions/DappAddressAliasTransaction/DappAddressAliasTransaction";
import DappMosaicIcon from "./graphics/DappMosaicIcon/DappMosaicIcon";
import DappMosaicAliasTransaction from "./graphics/transactions/DappMosaicAliasTransaction/DappMosaicAliasTransaction";
import DappMosaicDefinitionTransaction from "./graphics/transactions/DappMosaicDefinitionTransaction/DappMosaicDefinitionTransaction";
import DappMosaicSupplyChangeTransaction from "./graphics/transactions/DappMosaicSupplyChangeTransaction/DappMosaicSupplyChangeTransaction";
import DappTransferTransaction from "./graphics/transactions/DappTransferTransaction/DappTransferTransaction";
import DappContractOperation from "./widgets/DappContractOperation/DappContractOperation";
import DappTitleBar from "./widgets/DappTitleBar/DappTitleBar";

// exports
export type { Variant };
export {
  DappButton,
  DappContractOperation,
  DappDate,
  DappIcon,
  DappInput,
  DappMessage,
  DappMosaic,
  DappQR,
  DappTitle,
  DappTokenAmount,
  DappAccountAvatar,
  DappAccountCard,
  DappMessageCircle,
  DappMosaicCircle,
  DappNamespaceCircle,
  DappNamespaceUnlinkCircle,
  DappAddCircle,
  DappEditCircle,
  DappTransactionArrow,
  DappMosaicIcon,
  DappUnknownTransaction,
  DappAbstractTransaction,
  DappTransactionGraphic,
  DappAddressAliasTransaction,
  DappMosaicAliasTransaction,
  DappMosaicDefinitionTransaction,
  DappMosaicSupplyChangeTransaction,
  DappTransferTransaction,
  DappTitleBar,
};
