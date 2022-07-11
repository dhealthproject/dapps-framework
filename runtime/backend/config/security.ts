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
  auth: {
    secret: process.env.AUTH_TOKEN_SECRET,
    challengeSize: 8,
  },
  cookie: {
    name: "dapps.dhealth.universe",
    domain: "localhost",
  },
});
