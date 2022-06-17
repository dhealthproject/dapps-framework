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
import Header from "./Header/Header.vue";
import Footer from "./Footer/Footer.vue";
// internal dependencies
import HelloWorld from "./HelloWorld.vue";

export const AppComponents = { HelloWorld, Header, Footer };
export const LibComponents = { DappButton };
