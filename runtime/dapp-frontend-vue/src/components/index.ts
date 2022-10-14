/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { DappButton } from "@dhealth/components";

// internal dependencies
import Header from "./Header/Header.vue";
import Footer from "./Footer/Footer.vue";
import Loader from "./Loader/Loader.vue";
import ElevateLogo from "./ElevateLogo/ElevateLogo.vue";
import DividedScreen from "./DividedScreen/DividedScreen.vue";
import Card from "./Card/Card.vue";
import DirectionTriangle from "./DirectionTriangle/DirectionTriangle.vue";
import Tabs from "./Tabs/Tabs.vue";
import GenericList from "./GenericList/GenericList.vue";
import NavPanel from "./NavPanel/NavPanel.vue";
import UiButton from "./UiButton/UiButton.vue";
import UiPopup from "./UiPopup/UiPopup.vue";
import Toast from "./Toast/Toast.vue";
import Dropdown from "./Dropdown/Dropdown.vue";
import UserBalance from "./UserBalance/UserBalance.vue";
import ProgressBar from "./ProgressBar/ProgressBar.vue";
import Stats from "./Stats/Stats.vue";

// scoped export of application-level components
export const AppComponents = {
  Header,
  Footer,
  Loader,
  ElevateLogo,
  DividedScreen,
  Card,
  DirectionTriangle,
  Tabs,
  GenericList,
  NavPanel,
  UiButton,
  UiPopup,
  Toast,
  Dropdown,
  UserBalance,
  ProgressBar,
  Stats,
};

// scoped export of library-level components
export const LibComponents = { DappButton };
