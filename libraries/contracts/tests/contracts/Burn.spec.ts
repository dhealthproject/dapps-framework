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
import { Burn, BurnParameters } from "../../src/contracts/Burn";
import { MissingContractFieldError } from "../../src/errors/MissingContractFieldError";
import { dHealthNetwork } from "../../src/types/dHealthNetwork";

const mockAccountPublicKey =
  "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE";

const mockTransactionHash =
  "8C44A003C2B52EF18472B26A8E911AF1110ADA3E4131C6182EBF194BF36F66DD";

describe("contracts/Burn", () => {
  let instance: Burn;

  describe("constructor()", () => {
    beforeEach(() => {
      instance = new Burn({
        dappIdentifier: "fake-dapp",
        asset: "4ADBC6CEF9393B90",
        amount: 1,
        proof: mockTransactionHash,
      } as BurnParameters);
    });

    it("should accept 'asset', 'amount' and 'proof' input fields", () => {
      // prepare
      instance = new Burn({
        dappIdentifier: "fake-dapp",
        asset: "4ADBC6CEF9393B90",
        amount: 123,
        proof: mockTransactionHash,
      } as BurnParameters);

      // act
      const inputs: BurnParameters = (instance as any).inputs;

      // assert
      expect("asset" in inputs).to.be.equal(true);
      expect("amount" in inputs).to.be.equal(true);
      expect("proof" in inputs).to.be.equal(true);
      expect(inputs.asset).to.be.equal("4ADBC6CEF9393B90");
      expect(inputs.amount).to.be.equal(123);
      expect(inputs.proof).to.be.equal(mockTransactionHash);
    });

    it("should throw error given missing obligatory input", () => {
      // act
      try {
        new Burn({} as BurnParameters);
      } catch (e) {
        // missing "amount", "asset" and "proof"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }

      // act
      try {
        new Burn({
          dappIdentifier: "fake-dapp",
          //asset: "4ADBC6CEF9393B90", // <-- missing asset
          amount: 123,
          proof: mockTransactionHash,
        } as BurnParameters);
      } catch (e) {
        // missing "asset"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }

      // act
      try {
        new Burn({
          dappIdentifier: "fake-dapp",
          asset: "4ADBC6CEF9393B90",
          //amount: 123, // <-- missing amount
          proof: mockTransactionHash,
        } as BurnParameters);
      } catch (e) {
        // missing "asset"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }

      // act
      try {
        new Burn({
          dappIdentifier: "fake-dapp",
          asset: "4ADBC6CEF9393B90",
          amount: 123,
          // proof: mockTransactionHash, // <-- missing proof
        } as BurnParameters);
      } catch (e) {
        // missing "asset"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }
    });

    it("should accept change of 'version' field", () => {
      // act
      instance = new Burn(
        {
          dappIdentifier: "fake-dapp",
          asset: "4ADBC6CEF9393B90",
          amount: 123,
          proof: mockTransactionHash,
        } as BurnParameters,
        9999
      );
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
      instance = new Burn(
        {
          dappIdentifier: "fake-dapp",
          asset: "4ADBC6CEF9393B90",
          amount: 123,
          proof: mockTransactionHash,
        } as BurnParameters,
        1,
        dHealthFake
      );
      const params: NetworkParameters = (instance as any).parameters;

      // assert
      expect(params.generationHash).to.be.equal("not-the-same-network");
    });
  });

  describe("body()", () => {
    beforeEach(() => {
      instance = new Burn({
        dappIdentifier: "fake-dapp",
        asset: "4ADBC6CEF9393B90",
        amount: 123,
        proof: mockTransactionHash,
      } as BurnParameters);
    });

    it("should include 'asset', 'amount' and 'proof' fields", () => {
      // prepare
      instance = new Burn({
        dappIdentifier: "fake-dapp",
        asset: "4ADBC6CEF9393B90",
        amount: 123,
        proof: mockTransactionHash,
      } as BurnParameters);

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
      instance = new Burn({
        dappIdentifier: "fake-dapp",
        asset: "4ADBC6CEF9393B90",
        amount: 123,
        proof: mockTransactionHash,
      } as BurnParameters);
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

    it("should include base asset asset in transaction mosaics", () => {
      // prepare
      instance = new Burn({
        dappIdentifier: "fake-dapp",
        asset: "4ADBC6CEF9393B90",
        amount: 123,
        proof: mockTransactionHash,
      } as BurnParameters);

      // act
      const expectedJSON: string = instance.toJSON();
      const transaction: TransferTransaction = instance.toTransaction({
        recipientPublicKey: mockAccountPublicKey,
      } as TransactionParameters);

      // assert
      expect(transaction.message).to.not.be.undefined;
      expect(transaction.message.payload).to.not.be.undefined;
      expect(transaction.message.payload).to.be.equal(expectedJSON);
      expect(transaction.mosaics).to.not.be.undefined;
      expect(transaction.mosaics.length).to.be.equal(1);
      expect(transaction.mosaics[0].id.toHex()).to.be.equal("39E0C49FA322A459");
    });
  });
});
