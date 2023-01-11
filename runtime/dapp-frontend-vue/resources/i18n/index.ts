/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import translationsOnboarding from "./en/OnboardingScreen.json";
import commonTranslations from "./en/Common.json";
import loginTranslations from "./en/LoginScreen.json";
import dashboardTranslations from "./en/Dashboard.json";
import settingsTranslations from "./en/Settings.json";
import activitiesTranslations from "./en/Activities.json";
import legalTranslations from "./en/Legal.json";

// bundle all .JSON together
export default {
  langName: "en-US",
  ...translationsOnboarding,
  ...commonTranslations,
  ...loginTranslations,
  ...dashboardTranslations,
  ...settingsTranslations,
  ...activitiesTranslations,
  ...legalTranslations,
};
