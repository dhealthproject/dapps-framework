/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Tests
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { expect } from "chai";
import { TransferTransaction } from "@dhealth/sdk";

// internal dependencies
import type { ObjectLiteral } from "../../src/types/ObjectLiteral";
import type { NetworkParameters } from "../../src/types/NetworkParameters";
import type { TransactionParameters } from "../../src/types/TransactionParameters";
import { Handshake, HandshakeParameters } from "../../src/contracts/Handshake";
import { MissingContractFieldError } from "../../src/errors/MissingContractFieldError";
import { dHealthNetwork } from "../../src/types/dHealthNetwork";

const mockAccountPublicKey =
  "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE";

const mockTransactionHash =
  "8C44A003C2B52EF18472B26A8E911AF1110ADA3E4131C6182EBF194BF36F66DD";

const mockContractParameters = {
  dappIdentifier: "fake-dapp",
  issuer: "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE",
  recipient: "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE",
  operation: mockTransactionHash,
} as HandshakeParameters;

describe("contracts/Handshake", () => {
  let instance: Handshake;

  describe("constructor()", () => {
    beforeEach(() => {
      instance = new Handshake(mockContractParameters);
    });

    it("should accept 'issuer', 'recipient' and 'operation' input fields", () => {
      // prepare
      instance = new Handshake(mockContractParameters);

      // act
      const inputs: HandshakeParameters = (instance as any).inputs;

      // assert
      expect("issuer" in inputs).to.be.equal(true);
      expect("recipient" in inputs).to.be.equal(true);
      expect("operation" in inputs).to.be.equal(true);
      expect(inputs.issuer).to.be.equal(mockContractParameters.issuer);
      expect(inputs.recipient).to.be.equal(mockContractParameters.recipient);
      expect(inputs.operation).to.be.equal(mockTransactionHash);
    });

    it("should throw error given missing obligatory input", () => {
      // act
      try {
        new Handshake({} as HandshakeParameters);
      } catch (e) {
        // missing "issuer", "recipient" and "operation"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }

      // act
      try {
        new Handshake({
          dappIdentifier: "fake-dapp",
          //issuer: "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE", // <-- missing issuer
          recipient: "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE",
          operation: mockTransactionHash,
        } as HandshakeParameters);
      } catch (e) {
        // missing "issuer"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }

      // act
      try {
        new Handshake({
          dappIdentifier: "fake-dapp",
          issuer: "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE",
          //recipient: "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE", // <-- missing recipient
          operation: mockTransactionHash,
        } as HandshakeParameters);
      } catch (e) {
        // missing "recipient"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }

      // act
      try {
        new Handshake({
          dappIdentifier: "fake-dapp",
          issuer: "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE",
          recipient: "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE",
          //operation: mockTransactionHash, // <-- missing operation
        } as HandshakeParameters);
      } catch (e) {
        // missing "operation"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }
    });

    it("should accept change of 'version' field", () => {
      // act
      instance = new Handshake(mockContractParameters, 9999);
      const header: ObjectLiteral = instance.header;

      // assert
      expect(header.version).to.be.equal(9999);
    });

    it("should accept change of network parameters", () => {
      // prepare
      const dHealthFake = new dHealthNetwork({
        generationHash: "not-the-same-network",
      });

      // act
      instance = new Handshake(mockContractParameters, 1, dHealthFake);
      const params: NetworkParameters = (instance as any).parameters;

      // assert
      expect(params.generationHash).to.be.equal("not-the-same-network");
    });
  });

  describe("body()", () => {
    beforeEach(() => {
      instance = new Handshake(mockContractParameters);
    });

    it("should include 'asset', 'amount' and 'proof' fields", () => {
      // prepare
      instance = new Handshake(mockContractParameters);

      // act
      const body: ObjectLiteral = instance.body;

      // assert
      expect("asset" in body).to.be.equal(true);
      expect("amount" in body).to.be.equal(true);
      expect("proof" in body).to.be.equal(true);
      expect(body.asset).to.be.equal("4ADBC6CEF9393B90");
      expect(body.amount).to.be.equal(123);
      expect(body.proof).to.be.equal(mockTransactionHash);
    });
  });

  describe("toTransaction()", () => {
    beforeEach(() => {
      instance = new Handshake(mockContractParameters);
    });

    it("should accept recipient in transaction parameters", () => {
      // act
      const transaction: TransferTransaction = instance.toTransaction({
        recipientPublicKey: mockAccountPublicKey,
      } as TransactionParameters);

      // assert
      expect(transaction.recipientAddress.plain()).to.be.equal(
        "NDAPPH6ZGD4D6LBWFLGFZUT2KQ5OLBLU32K3HNY"
      );
    });

    it("should include correct JSON payload in transfer message", () => {
      // act
      const expectedJSON: string = instance.toJSON();
      const transaction: TransferTransaction = instance.toTransaction({
        recipientPublicKey: mockAccountPublicKey,
      } as TransactionParameters);

      // assert
      expect(transaction.message).to.not.be.undefined;
      expect(transaction.message.payload).to.not.be.undefined;
      expect(transaction.message.payload).to.be.equal(expectedJSON);
    });
  });
});
