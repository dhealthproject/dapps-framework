/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend Configuration
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

export default () => ({
  strava: {
    base_url: "https://www.strava.com/oauth",
    client_secret: "8e87fe57b896b624ca4fdfda561d98900d4dae3c", // @todo: MOVE THIS VALUE INTO .env
    oauth_url: "https://www.strava.com/oauth/authorize",
    redirect_url: "http://localhost:8080/", // @todo: REPLACE WITH THE VALID URL
    webhook_url:
      "https://us-central1-health-to-earn.cloudfunctions.net/webhook", // @todo: REPLACE WITH ELEVATE RELATED URL
    subscribe_url:
      "https://us-central1-health-to-earn.cloudfunctions.net/subscribe", // @todo: REPLACE WITH ELEVATE RELATED URL
    client_id: "92236", // @todo: MOVE THIS VALUE INTO .env
    verify_token: "94bc78225eba1282476d0ce6bcb3fe0ed789c2ee", // @todo: MOVE THIS VALUE INTO .env
  },
});
