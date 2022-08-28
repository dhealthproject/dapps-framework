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
import { Welcome, WelcomeParameters } from "../../src/contracts/Welcome";
import { dHealthNetwork } from "../../src/types/dHealthNetwork";

const mockAccountPublicKey =
  "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE";

describe("contracts/Welcome", () => {
  let instance: Welcome;

  describe("constructor()", () => {
    beforeEach(() => {
      instance = new Welcome({
        dappIdentifier: "fake-dapp",
      } as WelcomeParameters);
    });

    it("should accept 'message' input field", () => {
      // prepare
      instance = new Welcome({
        dappIdentifier: "fake-dapp",
        message: "Hello and welcome!",
      } as WelcomeParameters);

      // act
      const inputs: WelcomeParameters = (instance as any).inputs;

      // assert
      expect("message" in inputs).to.be.equal(true);
      expect(inputs.message).to.be.equal("Hello and welcome!");
    });

    it("should accept empty 'message' input", () => {
      // act
      try {
        new Welcome({} as WelcomeParameters);
        // assert
        // by execution of the following expect,
        // we know that the above didn't throw.
        expect(true).to.be.equal(true);
      } catch (e) {
        // if the above threw an error, break here.
        expect(false).to.be.equal(true);
      }
    });

    it("should accept change of 'version' field", () => {
      // act
      instance = new Welcome(
        {
          dappIdentifier: "fake-dapp",
          message: "Hello and welcome!",
        } as WelcomeParameters,
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
      instance = new Welcome(
        {
          dappIdentifier: "fake-dapp",
          message: "Hello and welcome!",
        } as WelcomeParameters,
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
      instance = new Welcome({
        dappIdentifier: "fake-dapp",
        message: "Hello and welcome!",
      } as WelcomeParameters);
    });

    it("should include 'message' field", () => {
      // prepare
      instance = new Welcome({
        dappIdentifier: "fake-dapp",
        message: "Hello and welcome!",
      } as WelcomeParameters);

      // act
      const body: ObjectLiteral = instance.body;

      // assert
      expect("message" in body).to.be.equal(true);
      expect(body.message).to.be.equal("Hello and welcome!");
    });
  });

  describe("toTransaction()", () => {
    beforeEach(() => {
      instance = new Welcome({
        dappIdentifier: "fake-dapp",
        message: "Hello and welcome!",
      } as WelcomeParameters);
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
