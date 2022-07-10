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
import DappButton from "./controls/DappButton/DappButton.vue";
import DappQR from "./widgets/DappQR/DappQR.vue";
import DappTokenAmount from "./fields/DappTokenAmount/DappTokenAmount.vue";
import DappAccountAvatar from "./graphics/DappAccountAvatar/DappAccountAvatar.vue";
import DappAccountCard from "./widgets/DappAccountCard/DappAccountCard.vue";
import DappMessageCircle from "./graphics/DappMessageCircle/DappMessageCircle.vue";
import DappMosaicCircle from "./graphics/DappMosaicCircle/DappMosaicCircle.vue";
import DappTransactionArrow from "./graphics/DappTransactionArrow/DappTransactionArrow.vue";
import DappTransferTransaction from "./transaction-graphics/DappTransferTransaction/DappTransferTransaction.vue";
import DappUnknownTransaction from "./transaction-graphics/DappUnknownTransaction/DappUnknownTransaction.vue";
import DappAbstractTransaction from "./transaction-graphics/DappAbstractTransaction/DappAbstractTransaction.vue";
import DappTransactionGraphic from "./widgets/DappTransactionGraphic/DappTransactionGraphic.vue";

// exports components as named-exports
export {
  DappButton,
  DappQR,
  DappTokenAmount,
  DappAccountAvatar,
  DappAccountCard,
  DappMessageCircle,
  DappMosaicCircle,
  DappTransactionArrow,
  DappTransferTransaction,
  DappUnknownTransaction,
  DappAbstractTransaction,
  DappTransactionGraphic,
};
