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
import { Profile } from "@/modules/Profile/Profile";

@Component({})
export default class TermsOfServicePage extends MetaView {
  private service = new Profile();
  async mounted() {
    try {
      const me = await this.service.getMe();
      console.log({ me });
    } catch (err) {
      console.log("Terms of use page: ", err);
    }
  }
}
