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

// external dependencies
import { TransactionType } from "@dhealth/sdk";

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

// Mocks an unsigned transfer transaction with message
const mockUnsignedTransferTransaction = 
    "C400000000000000000000000000000000000000000000000000000000000000"
  + "0000000000000000000000000000000000000000000000000000000000000000"
  + "0000000000000000000000000000000000000000000000000000000000000000"
  + "000000000000000000000000016854410100000000000000545873E209000000"
  + "68B09718CA4D1CF2A6E97CAE1AB192B1317E1EDB519349CC1400010000000000"
  + "59A422A39FC4E03940420F0000000000007468697320697320746865206D6573"
  + "73616765";

const mockMosaicId = "fake-mosaic-id";

// Mocks a **transaction** factory for internal
// integrations of `@dhealth/sdk` and working with
// signatures, payloads and serialized transactions.
export const createTransaction = (
  hash: string = "fakeHash1",
  type: TransactionType = TransactionType.TRANSFER,
): any => ({
  transactionInfo: { hash, height: { compact: jest.fn() } },
  signer: { address: { plain: jest.fn() } },
  recipientAddress: { plain: jest.fn()},
  type,
  serialize: jest.fn().mockReturnValue(mockUnsignedTransferTransaction),
  message: { payload: "fakePayload" },
  mosaics: [
    {
      id: { toHex: jest.fn().mockReturnValue(mockMosaicId) },
      amount: {
        compact: jest.fn(),
        equals: jest.fn().mockReturnValue(false),
      },
    }
  ]
});

// Mocks a **model** class for nestjs internal
// mongoose integration with FIND, CREATE, UPDATE
// and AGGREGATE logic mocked out and spied on.
export class MockModel {
  public data: Record<string, any>;
  public createStub: any = jest.fn(() => this.data);
  constructor(dto?: any) {
    this.data = dto;
  }
  create(data: any) {
    return this.createStub(data);
  }
  save() {
    return jest.fn(() => this.data).call(this);
  }
  findOne() {
    return jest.fn(() => this.data);
  }
  find() {
    return {
      exec: () => this.data,
    };
  }
  aggregate(param: any) {
    return jest
      .fn((param) => ({
        param: () => param,
        exec: () =>
          Promise.resolve([
            {
              data: [{}],
              metadata: [{ total: 1 }],
            },
          ]),
      }))
      .call(this, param);
  }
}

// Creates a HTTP Query Parameters parser that
// is used to verify the presence of fields in
// a string-formatted HTTP Query, e.g. "?test"
export const httpQueryStringParser = (
  search: string,
  decode: boolean = true,
): Record<string, string> => (search || '')
  .replace(/^\?/g, '')
  .split('&')
  .reduce((acc, query) => {
    const [key, value] = query.split('=');
    if (key) {
      acc[key] = decode ? decodeURIComponent(value) : value;
    }
    return acc;
  }, {} as Record<string, string>);

// sets mocked environment variables
process.env.DB_USER = "fake-user";
process.env.DB_PASS = "fake-pass";
process.env.DB_HOST = "fake-host";
process.env.DB_PORT = "1234";
process.env.DB_NAME = "fake-db-name";
process.env.AUTH_TOKEN_SECRET="fake-auth-token";
process.env.BACKEND_DOMAIN="fake-backend-host";
process.env.BACKEND_PORT="4321";
process.env.FRONTEND_DOMAIN="fake-frontend-host";
process.env.FRONTEND_PORT="9876";
process.env.ANOTHER_DB_NAME_THROUGH_ENV = "this-exists-only-in-mock";
