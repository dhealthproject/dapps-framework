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
import { Earn, EarnParameters } from "../../src/contracts/Earn";
import { MissingContractFieldError } from "../../src/errors/MissingContractFieldError";
import { dHealthNetwork } from "../../src/types/dHealthNetwork";

const mockAccountPublicKey =
  "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE";

describe("contracts/Earn", () => {
  let instance: Earn;

  describe("constructor()", () => {
    beforeEach(() => {
      instance = new Earn({
        dappIdentifier: "fake-dapp",
        date: "20220829",
      } as EarnParameters);
    });

    it("should accept 'date' input field", () => {
      // prepare
      instance = new Earn({
        dappIdentifier: "fake-dapp",
        date: "2022-08-29",
      } as EarnParameters);

      // act
      const inputs: EarnParameters = (instance as any).inputs;

      // assert
      expect("date" in inputs).to.be.equal(true);
      expect(inputs.date).to.be.equal("2022-08-29");
    });

    it("should throw error given missing 'date' input", () => {
      // act
      try {
        new Earn({} as EarnParameters);
      } catch (e) {
        // missing "date"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }
    });

    it("should accept optional 'asset' and 'amount' input fields", () => {
      // prepare
      instance = new Earn({
        dappIdentifier: "fake-dapp",
        date: "2022-08-29",
        asset: "4ADBC6CEF9393B90",
        amount: 1,
      } as EarnParameters);

      // act
      const inputs: EarnParameters = (instance as any).inputs;

      // assert
      expect("date" in inputs).to.be.equal(true);
      expect(inputs.date).to.be.equal("2022-08-29");
      expect(inputs.asset).to.be.equal("4ADBC6CEF9393B90");
      expect(inputs.amount).to.be.equal(1);
    });

    it("should accept change of 'version' field", () => {
      // act
      instance = new Earn(
        {
          dappIdentifier: "fake-dapp",
          date: "2022-08-29",
        } as EarnParameters,
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
      instance = new Earn(
        {
          dappIdentifier: "fake-dapp",
          date: "2022-08-29",
        } as EarnParameters,
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
      instance = new Earn({
        dappIdentifier: "fake-dapp",
        date: "2022-08-29",
      } as EarnParameters);
    });

    it("should include 'date' field", () => {
      // prepare
      instance = new Earn({
        dappIdentifier: "fake-dapp",
        date: "20220829",
      } as EarnParameters);

      // act
      const body: ObjectLiteral = instance.body;

      // assert
      expect("date" in body).to.be.equal(true);
      expect(body.date).to.be.equal("20220829");
    });
  });

  describe("toTransaction()", () => {
    beforeEach(() => {
      instance = new Earn({
        dappIdentifier: "fake-dapp",
        date: "2022-08-29",
      } as EarnParameters);
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

    it("should include asset and amount in JSON payload", () => {
      // prepare
      instance = new Earn({
        dappIdentifier: "fake-dapp",
        date: "2022-08-29",
        asset: "4ADBC6CEF9393B90",
        amount: 123,
      } as EarnParameters);

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
      expect(transaction.mosaics[0].id.toHex()).to.be.equal("4ADBC6CEF9393B90");
    });
  });
});
