/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { TransactionMapping, TransferTransaction } from "@dhealth/sdk";

// internal dependencies
import { mockUnsignedTransferTransaction } from "../../../mocks/global";
import { SignerService } from "../../../../src/payout/services/SignerService";

describe("payout/SignerService", () => {
  let service: SignerService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SignerService,
        ConfigService,
      ],
    }).compile();

    service = module.get<SignerService>(SignerService);
    configService = module.get<ConfigService>(ConfigService);

  });

  describe("constructor()", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
    });
  });

  describe("signTransaction()", () => {
    let accountSignMock: any;
    beforeEach(() => {
      accountSignMock = jest.fn();
      (service as any).signerAccount = {
        sign: accountSignMock, // <- forced mock
      };
      accountSignMock.mockClear();
    });

    it("should use correct generation hash for signature process", () => {
      // prepare
      const expectedGenHash = "using a fake genHash";
      (service as any).generationHash = expectedGenHash;
      const transaction = TransactionMapping.createFromPayload(
        mockUnsignedTransferTransaction,
        false,
      ) as TransferTransaction;

      // act
      service.signTransaction(transaction);

      // assert
      expect(accountSignMock).toHaveBeenCalledTimes(1);
      expect(accountSignMock).toHaveBeenCalledWith(
        transaction,
        expectedGenHash,
      );
    });

    it("should delegate execution to SDK Account class", () => {
      // prepare
      const transaction = TransactionMapping.createFromPayload(
        mockUnsignedTransferTransaction,
        false,
      ) as TransferTransaction;

      // act
      service.signTransaction(transaction);

      // assert
      expect(accountSignMock).toHaveBeenCalledTimes(1);
    });
  });
});