/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

// This file contains **mocks** that are exported
// for re-use in different testing modules.

// These external dependencies mocks *must* be defined
// **before** internal class imports such that the mocks
// are correctly used in other source code files.

// Mocks the full `@dhealth/sdk` dependency to avoid
// calls to underlying network repositories and tools.
// Further testing of entities *may* overwrite the mock.
jest.mock("@dhealth/sdk");

// Mocks the full `js-sha3` dependency to avoid
// calls to actual SHA3/Keccak algorithms.
jest.mock("js-sha3", () => ({
  sha3_256: {
    update: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
    arrayBuffer: jest.fn(),
  },
}));
