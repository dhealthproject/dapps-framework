/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
//import { expect } from "@jest/globals";

// This file contains **mocks** that are exported
// for re-use in different testing modules.

// These external dependencies mocks *must* be defined
// **before** internal class imports such that the mocks
// are correctly used in other source code files.

// Mocks some of the `@dhealth/sdk` dependency to avoid
// calls to underlying network repositories and tools.
// Further testing of entities *may* overwrite the mock.
jest.mock("@dhealth/sdk", () => ({
  Address: {
    createFromRawAddress: jest.fn().mockReturnValue({
      plain: jest.fn(),
    }),
  },
  Deadline: { create: jest.fn() },
  Mosaic: jest.fn(),
  MosaicId: jest.fn().mockReturnValue({
    amount: { compact: jest.fn() },
  }),
  NetworkType: {
    MAIN_NET: "fakeMainnet",
    TEST_NET: "fakeTestnet",
  },
  PlainMessage: { create: jest.fn() },
  Transaction: {
    recipientAddress: { plain: jest.fn() },
    serialize: jest.fn(),
    signer: { address: { plain: jest.fn() } },
    transactionInfo: {
      hash: "fake-hash",
      height: { compact: jest.fn() },
    },
  },
  TransferTransaction: { create: jest.fn() },
  UInt64: {
    fromUint: jest.fn(),
  },
}));

// Mocks some of the components in `@dhealth/components`
// Tests for these components are not implemented here
jest.mock("@dhealth/components", () => ({
  DappButton: {
    get: jest.fn(),
    set: jest.fn(),
    render: jest.fn(),
  },
  DappQR: {
    get: jest.fn(),
    set: jest.fn(),
    render: jest.fn(),
  },
}));

// Mocks some of the classes in `@dhealth/qr-library`
// Tests for these classes are not implemented here
export const createTransactionRequestMock = jest.fn();
jest.mock("@dhealth/qr-library", () => ({
  QRCodeGenerator: {
    createTransactionRequest: createTransactionRequestMock,
  },
}));

// Mocks the full `js-sha3` dependency to avoid
// calls to actual SHA3/Keccak algorithms.
jest.mock("js-sha3", () => ({
  sha3_256: {
    update: jest.fn().mockReturnThis(),
    create: jest.fn().mockReturnThis(),
    arrayBuffer: jest.fn(),
  },
}));

globalThis.fetch = { bind: (data: any) => data } as any;
