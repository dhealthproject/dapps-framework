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
  contracts: [
    "elevate:auth",
    "elevate:earn",
    "elevate:referral",
    "elevate:welcome",
  ],
  operations: [
    {
      contract: "elevate:auth",
      label: "Session|Sessions",
      query: {
        sourceAddress: "NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY",
        transactionMode: "incoming",
      }
    },
    {
      contract: "elevate:earn",
      label: "Activity|Activities",
      query: {
        sourceAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        transactionMode: "outgoing",
      }
    },
    {
      contract: "elevate:referral",
      label: "Referral|Referrals",
      query: {
        sourceAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        transactionMode: "outgoing",
      }
    },
    {
      contract: "elevate:welcome",
      label: "Greeting|Greetings",
      query: {
        sourceAddress: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
        transactionMode: "outgoing",
      }
    },
  ],
});
