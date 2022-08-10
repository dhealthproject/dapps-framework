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
import DappAccountAvatar from "./graphics/DappAccountAvatar/DappAccountAvatar.vue";
import DappAccountCard from "./widgets/DappAccountCard/DappAccountCard.vue";
import DappButton from "./controls/DappButton/DappButton.vue";
import DappQR from "./widgets/DappQR/DappQR.vue";
import DappTokenAmount from "./fields/DappTokenAmount/DappTokenAmount.vue";
import DappIcon from "./graphics/DappIcon/DappIcon.vue";
import DappInput from "./fields/DappInput/DappInput.vue";
import DappTitle from "./texts/DappTitle/DappTitle.vue";
import DappDate from "./fields/DappDate/DappDate.vue";
import DappMessage from "./fields/DappMessage/DappMessage.vue";
import DappMosaic from "./fields/DappMosaic/DappMosaic.vue";

// exports components as named-exports
export {
  DappAccountAvatar,
  DappAccountCard,
  DappButton,
  DappDate,
  DappIcon,
  DappInput,
  DappMessage,
  DappMosaic,
  DappQR,
  DappTitle,
  DappTokenAmount,
};
