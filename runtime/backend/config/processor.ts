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
  contracts: {
    "elevate:auth": {
      label: "Session|Sessions",
      source: "NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY",
      mode: "incoming",
    },
    "elevate:earn": {
      label: "Activity|Activities",
      source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
      mode: "outgoing",
    },
    "elevate:ref": {
      label: "Referral|Referrals",
      source: "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY",
      mode: "outgoing",
    },
  },
});
