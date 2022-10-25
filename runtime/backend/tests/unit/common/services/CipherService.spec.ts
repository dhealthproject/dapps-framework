/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// import overwrites for @dhealth/sdk
// These following mocks are used in this unit test series.
// Mocks a subset of "@dhealth/sdk" including classes:
// - Crypto to always return encrypted/decrypted payloads
jest.mock("@dhealth/sdk", () => ({
  Crypto: {
    encrypt: jest.fn().mockReturnValue("fake-encrypted-payload"),
    decrypt: jest.fn().mockReturnValue("fake-plaintext-payload"),
  }
}));

// external dependencies
import { Test, TestingModule } from "@nestjs/testing";
import { Crypto } from "@dhealth/sdk";

// internal dependencies
import { CipherService } from "../../../../src/common/services/CipherService";

describe("common/CipherService", () => {
  let service: CipherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CipherService,
      ],
    }).compile();

    service = module.get<CipherService>(CipherService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("encrypt() -->", () => {
    it ("should accept data and password for PBKDF2 encryption", () => {
      // act
      service.encrypt("test-data", "test-pw");

      // assert
      expect(Crypto.encrypt).toHaveBeenCalledTimes(1);
      expect(Crypto.encrypt).toHaveBeenCalledWith(
        "test-data",
        "test-pw",
      );
    });

    it ("should throw an error given undefined data or password", () => {
      // act+assert
      expect(() => service.encrypt(undefined, "test-pw"))
        .toThrow(`Encryption data and password cannot be undefined.`);

      expect(() => service.encrypt("test-data", undefined))
        .toThrow(`Encryption data and password cannot be undefined.`);
    });
  });

  describe("decrypt() -->", () => {
    let payload: string;
    beforeEach(() => {
      (service as any).encrypt = jest.fn().mockReturnValue(
        "fake-encrypted-payload",
      );
      payload = service.encrypt("test-data", "test-pw");
    });

    it ("should accept data and password for PBKDF2 decryption", () => {
      // act
      service.decrypt(payload, "test-pw");

      // assert
      expect(Crypto.decrypt).toHaveBeenCalledTimes(1);
      expect(Crypto.decrypt).toHaveBeenCalledWith(
        "fake-encrypted-payload",
        "test-pw",
      );
    });

    it ("should throw an error given undefined data or password", () => {
      // act+assert
      expect(() => service.decrypt(undefined, "test-pw"))
        .toThrow(`Ciphertext and password cannot be undefined.`);

      expect(() => service.decrypt("test-payload", undefined))
        .toThrow(`Ciphertext and password cannot be undefined.`);
    });
  });
});
