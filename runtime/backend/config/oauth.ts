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
  providers: {
    strava: {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      verify_token: process.env.STRAVA_VERIFY_TOKEN,
      scope: "activity:read_all",
      oauth_url: "https://www.strava.com/oauth/authorize",
      callback_url: process.env.FRONTEND_URL,
      subscribe_url: `${process.env.FRONTEND_URL}/subscribe`,
      webhook_url: `${process.env.FRONTEND_URL}/webhook`,
    }
  }
});
