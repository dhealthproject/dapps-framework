/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/* eslint-disable no-console */
import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log(
        "[INFO] dHealth dApp is being served from cache by a service worker.\n" +
          "For more details, visit https://goo.gl/AFskqB"
      );
    },
    registered() {
      console.log("[INFO] Service worker has been registered.");
    },
    cached() {
      console.log("[INFO] Content has been cached for offline use.");
    },
    updatefound() {
      console.log("[INFO] New content is downloading.");
    },
    updated() {
      console.log("[INFO] New content is available; please refresh.");
    },
    offline() {
      console.log(
        "[INFO] No internet connection found. dHealth dApp is running in offline mode."
      );
    },
    error(error) {
      console.error("Error during service worker registration:", error);
    },
  });
}
