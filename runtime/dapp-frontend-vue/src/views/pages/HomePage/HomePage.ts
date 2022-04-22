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

// child components
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Options({
  components: {
    HelloWorld,
  },
  props: {
    metaInfo: {
      meta: [{ name: "title", content: "Home of ..." }],
    },
  },
})
export default class HomePage extends MetaView {}
