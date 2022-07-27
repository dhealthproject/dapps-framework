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
import HelloWorld from "./HelloWorld.vue";
import Header from "./Header/Header.vue";
import Footer from "./Footer/Footer.vue";
import Loader from "./Loader/Loader.vue";
import ElevateLogo from "./ElevateLogo/ElevateLogo.vue";
import DividedScreen from "./DividedScreen/DividedScreen.vue";
import Card from "./Card/Card.vue";
import DirectionTriangle from "./DirectionTriangle/DirectionTriangle.vue";
import Tabs from "./Tabs/Tabs.vue";

// scoped export of application-level components
export const AppComponents = {
  HelloWorld,
  Header,
  Footer,
  Loader,
  ElevateLogo,
  DividedScreen,
  Card,
  DirectionTriangle,
  Tabs,
};

// scoped export of library-level components 
export const LibComponents = { DappButton };
