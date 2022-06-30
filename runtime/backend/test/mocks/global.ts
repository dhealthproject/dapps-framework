/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
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

// Mocks a **model** class for nestjs internal
// mongoose integration with FIND, CREATE, UPDATE
// and AGGREGATE logic mocked out and spied on.
export class MockModel {
  public data: Record<string, any>;
  constructor(dto?: any) {
    this.data = dto;
  }
  save() {
    return jest.fn(() => this.data).call(this);
  }
  find() {
    return {
      exec: () => this.data,
    };
  }
  aggregate(param: any) {
    return jest.fn((param) => ({
      param: () => param,
      exec: () => Promise.resolve([{
        data: [{}],
        metadata: [{ total: 1 }],
      }]),
    })).call(this, param);
  }
}
