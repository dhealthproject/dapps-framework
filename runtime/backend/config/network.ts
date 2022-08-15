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
  defaultNode: "http://dual-02.dhealth.cloud:3000",
  apiNodes: [
    { "url": "http://dual-01.dhealth.cloud:3000", "port": 3000 },
    { "url": "http://dual-02.dhealth.cloud:3000", "port": 3000 },
    { "url": "http://dual-03.dhealth.cloud:3000", "port": 3000 },
    { "url": "http://api-01.dhealth.cloud:3000", "port": 3000 },
    { "url": "http://api-02.dhealth.cloud:3000", "port": 3000 }
  ],
  network: {
    namespaceName: "dhealth.dhp",
    mosaicId: "39E0C49FA322A459",
    namespaceId: "9D8930CDBB417337",
    divisibility: 6,
    networkIdentifier: 104,
    epochAdjustment: 1616978397,
    generationHash: "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16"
  }
});
