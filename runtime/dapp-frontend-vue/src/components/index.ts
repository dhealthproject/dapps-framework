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
import AppHeader from "./AppHeader/AppHeader.vue";
import Card from "./Card/Card.vue";
import DappSelect from "./DappSelect/DappSelect.vue";
import DirectionTriangle from "./DirectionTriangle/DirectionTriangle.vue";
import DividedScreen from "./DividedScreen/DividedScreen.vue";
import Dropdown from "./Dropdown/Dropdown.vue";
import ElevateLogo from "./ElevateLogo/ElevateLogo.vue";
import Footer from "./Footer/Footer.vue";
import GenericList from "./GenericList/GenericList.vue";
import InfoTip from "./InfoTip/InfoTip.vue";
import Leaderboard from "./Leaderboard/Leaderboard.vue";
import LeaderboardRow from "./LeaderboardRow/LeaderboardRow.vue";
import Loader from "./Loader/Loader.vue";
import MobileNavigationButton from "./MobileNavigationButton/MobileNavigationButton.vue";
import NavPanel from "./NavPanel/NavPanel.vue";
import ProgressBar from "./ProgressBar/ProgressBar.vue";
import ReferralInput from "./ReferralInput/ReferralInput.vue";
import Stats from "./Stats/Stats.vue";
import Tabs from "./Tabs/Tabs.vue";
import Toast from "./Toast/Toast.vue";
import TopActivities from "./TopActivities/TopActivities.vue";
import UiButton from "./UiButton/UiButton.vue";
import UiPopup from "./UiPopup/UiPopup.vue";
import UserBalance from "./UserBalance/UserBalance.vue";
import RewardsList from "./RewardsList/RewardsList.vue";

// scoped export of application-level components
export const AppComponents = {
  AppHeader,
  Card,
  DappSelect,
  DirectionTriangle,
  DividedScreen,
  Dropdown,
  ElevateLogo,
  Footer,
  GenericList,
  InfoTip,
  Leaderboard,
  LeaderboardRow,
  Loader,
  MobileNavigationButton,
  NavPanel,
  ProgressBar,
  ReferralInput,
  Stats,
  Tabs,
  Toast,
  TopActivities,
  UiButton,
  UiPopup,
  UserBalance,
  RewardsList,
};

// scoped export of library-level components
export const LibComponents = { DappButton };
