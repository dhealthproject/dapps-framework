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
  dappName: "ELEVATE",
  dappPublicKey: "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE",
  authAuthority: "NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY",
  scopes: [
    "database",
    "discovery",
    "payout",
    "processor"
  ],
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    name: process.env.DB_NAME,
    user: process.env.DB_USER,
  },
  discovery: {
    sources: [
      "NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY", // authAuthority (login contract)
      "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY", // main interactions account
    ],
  }
});
