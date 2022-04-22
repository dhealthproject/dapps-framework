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
import { Options } from "vue-class-component";

// internal dependencies
import { MetaView } from "@/views/MetaView";

@Options({
  methods: {
    pageName() {
      return "About";
    },
  },
})
export default class AboutPage extends MetaView {}
