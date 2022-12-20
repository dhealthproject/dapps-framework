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
import { TransactionDTO } from "@/discovery/models/TransactionDTO";
import { Convert, TransactionMapping, Transaction as SdkTransaction } from "@dhealth/sdk";

// internal dependencies
import { Transaction, TransactionDocument } from "../../../../src/common/models/TransactionSchema";

describe("common/TransactionSchema", () => {
  describe("get toQuery()", () => {
    it("should add properties from schema to query", () => {
      // prepare
      const transaction = new Transaction();
      (transaction as any).signerAddress = "test-signerAddress";
      (transaction as any).recipientAddress = "test-recipientAddress";
      (transaction as any).transactionHash = "test-transactionHash";
      (transaction as any).transactionMessage = "test-transactionMessage";

      // act
      const result = transaction.toQuery;

      // assert
      expect(result.signerAddress).toBe(transaction.signerAddress);
      expect(result.recipientAddress).toBe(transaction.recipientAddress);
      expect(result.transactionHash).toBe(transaction.transactionHash);
      expect(result.transactionMessage).toBe(transaction.transactionMessage);
    });

    it("should return empty if transaction object doesn't have fields", () => {
      // prepare
      const transaction = new Transaction();

      // act
      const result = transaction.toQuery;

      // assert
      expect(result).toStrictEqual({});
    });
  });

  describe("toSDK()", () => {
    it("should return correct value", () => {
      // prepare
      let createFromPayloadCall = jest
        .spyOn(TransactionMapping, "createFromPayload")
        .mockReturnValue({} as SdkTransaction);
      const transaction = new Transaction();
      (transaction as any).encodedBody = "ABC";
      const convertNumberToUint8ArrayCall = jest
        .spyOn(Convert, "numberToUint8Array")
        .mockReturnValue(new Uint8Array());
      const convertHexToUint8Call = jest
        .spyOn(Convert, "hexToUint8")
        .mockReturnValue(new Uint8Array());

      // act
      const result = transaction.toSDK();

      // assert
      expect(convertNumberToUint8ArrayCall).toHaveBeenCalledTimes(8);
      expect(convertHexToUint8Call).toHaveBeenCalledTimes(2);
      expect(createFromPayloadCall).toHaveBeenCalledTimes(1);
      expect(result).toStrictEqual({});
    });
  });

  describe("fillDTO()", () => {
    it("should create correct result", () => {
      // prepare
      const transactionDocument = {
        signerAddress: "test-signerAddress",
        recipientAddress: "test-recipientAddress",
        transactionHash: "test-transactionHash",
        creationBlock: 1,
      } as TransactionDocument;
      const transactionDTO = {} as TransactionDTO;

      // act
      const result = Transaction.fillDTO(transactionDocument, transactionDTO);

      // assert
      expect(result).toStrictEqual(transactionDocument);
    });
  });
});