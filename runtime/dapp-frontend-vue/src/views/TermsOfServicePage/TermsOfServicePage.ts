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
import { Component } from "vue-property-decorator";
// internal dependencies
import { MetaView } from "@/views/MetaView";
import { BackendService } from "../OnboardingPage/OnboardingPage";

const service = new BackendService();

@Component({})
export default class TermsOfServicePage extends MetaView {
  async mounted() {
    const me = await service.getMe();
    console.log({ me });
  }
}
