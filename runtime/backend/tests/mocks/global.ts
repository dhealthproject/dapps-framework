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

// Mocks the monitoring configuration
jest.mock("../../config/monitoring", () => {
  return () => ({
    storage: [
      { type: "console", level: "debug" },
      { type: "filesystem", level: "info" },
    ],
    logLevels: {
      error: 0,
      warn: 1,
      info: 2,
      debug: 3,
    },
    logDirectoryPath: "./logs/",
    logMaxFileSize: 1000,
    enableAlerts: true,
    alerts: {
      type: ["warn", "error"],
      transport: "mail",
      recipient: "recipient@example.com",
    },
    enableReports: true,
    reports: {
      type: ["warn", "error"],
      transport: "mail",
      period: "W",
      recipient: "recipient@example.com",
    },
  });
});

// Mocks the winston module as logs are core
// to the runtime execution and log from anywhere
jest.mock("winston-mongodb");
jest.mock("winston-daily-rotate-file", () => {
  return jest.fn();
});
export const TestWinstonLogger = {
  log: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  verbose: jest.fn(),
  setLogLevels: jest.fn(),
};
jest.mock("nest-winston", () => ({
  utilities: {
    format: {
      nestLike: jest.fn(),
    },
  },
  WinstonModule: { createLogger: jest.fn().mockReturnValue(TestWinstonLogger) },
}));

export class TestMongoDBTransport {}
export class TestConsoleTransport {}
export class TestDailyRotateFileTransport {}
export class TestFileTransportErrors {}
jest.mock("winston", () => ({
  format: {
    timestamp: jest.fn(),
    ms: jest.fn(),
    combine: jest.fn(),
    metadata: jest.fn(),
  },
  transports: {
    MongoDB: TestMongoDBTransport,
    Console: TestConsoleTransport,
    DailyRotateFile: TestDailyRotateFileTransport,
    File: TestFileTransportErrors,
  },
}));

// Mocks an unsigned transfer transaction with message
export const mockUnsignedTransferTransaction =
  "C400000000000000000000000000000000000000000000000000000000000000" +
  "0000000000000000000000000000000000000000000000000000000000000000" +
  "0000000000000000000000000000000000000000000000000000000000000000" +
  "000000000000000000000000016854410100000000000000545873E209000000" +
  "68B09718CA4D1CF2A6E97CAE1AB192B1317E1EDB519349CC1400010000000000" +
  "59A422A39FC4E03940420F0000000000007468697320697320746865206D6573" +
  "73616765";

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
  recipientAddress: { plain: jest.fn() },
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
    },
  ],
});

// Mocks a **transaction document** factory for internal
// integrations of database transactions and working with
// database copies of assets and users.
export const createTransactionDocument = (
  hash: string = "fakeHash1",
  transactionMode?: string,
): any => ({
  transactionHash: hash,
  sourceAddress: "fake-source",
  signerAddress: "fake-signer",
  signerPublicKey: "fake-signer-public-key",
  recipientAddress: "fake-recipient",
  transactionMode: transactionMode,
  transactionType: "fake-type",
  creationBlock: 1,
  transactionAssets: [
    {
      mosaicId: "testMosaicId",
      amount: 1,
      transactionHash: "testTransactionHash",
    },
  ],
  transactionMessage: "fakeMessage",
});

// Mocks a **model** class for nestjs internal
// mongoose integration with FIND, CREATE, UPDATE
// and AGGREGATE logic mocked out and spied on.
export class MockModel {
  public data: Record<string, any>;
  public createStub: any = jest.fn(() => this.data);
  public static createStub: any = jest.fn((data) => data);
  constructor(dto?: any) {
    this.data = dto;
  }
  static create(data: any) {
    return MockModel.createStub(data);
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
  static findOne() {
    return {
      exec: () => jest.fn(),
    };
  }
  deleteOne() {
    return {
      exec: () => jest.fn(),
    };
  }
  static findOneAndUpdate() {
    return {
      exec: () => jest.fn(),
    };
  }
  find() {
    return {
      exec: () => this.data,
    };
  }
  deleteOne(query: any) {
    return {
      exec: async () => jest.fn(),
    };
  }
  static deleteOne(query: any) {
    return {
      exec: async () => jest.fn(),
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
  static aggregate(param: any) {
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
): Record<string, string> =>
  (search || "")
    .replace(/^\?/g, "")
    .split("&")
    .reduce((acc, query) => {
      const [key, value] = query.split("=");
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
process.env.BACKEND_URL = "fake-backend-url";
process.env.BACKEND_DOMAIN = "fake-backend-host";
process.env.BACKEND_INTERNAL_PORT = "4321";
process.env.BACKEND_EXTERNAL_PORT = "4321";
process.env.FRONTEND_URL = "fake-frontend-url";
process.env.FRONTEND_DOMAIN = "fake-frontend-host";
process.env.FRONTEND_PORT = "9876";
process.env.SECURITY_AUTH_TOKEN_SECRET = "fake-auth-token";
process.env.LOGS_DIRECTORY_PATH = "/logs";
process.env.SMTP_HOST = "fake.smtp.server";
process.env.SMTP_PORT = "587";
process.env.SMTP_USER = "fakeMailerUser";
process.env.SMTP_PASSWORD = "fakePassword";
process.env.FROM = "Fake Mailer <mailer@dhealth.foundation>";
process.env.ANOTHER_DB_NAME_THROUGH_ENV = "this-exists-only-in-mock";
process.env.MAIN_PUBLIC_KEY =
  "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE";
process.env.MAIN_ADDRESS = "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY";
