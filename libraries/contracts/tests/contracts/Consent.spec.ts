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
import { Consent, ConsentParameters } from "../../src/contracts/Consent";
import { MissingContractFieldError } from "../../src/errors/MissingContractFieldError";
import { dHealthNetwork } from "../../src/types/dHealthNetwork";

const mockAccountPublicKey =
  "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE";

const mockContractParameters = {
  dappIdentifier: "fake-dapp",
  level: "read",
  scope: "fakeScopeHash",
  purpose: "encrypted purpose message",
} as ConsentParameters;

describe("contracts/Consent", () => {
  let instance: Consent;

  describe("constructor()", () => {
    beforeEach(() => {
      instance = new Consent(mockContractParameters);
    });

    it("should accept 'challenge' input field", () => {
      // prepare
      instance = new Consent(mockContractParameters);

      // act
      const inputs: ConsentParameters = (instance as any).inputs;

      // assert
      expect("level" in inputs).to.be.equal(true);
      expect("scope" in inputs).to.be.equal(true);
      expect("purpose" in inputs).to.be.equal(true);
      expect(inputs.level).to.be.equal(mockContractParameters.level);
      expect(inputs.scope).to.be.equal(mockContractParameters.scope);
      expect(inputs.purpose).to.be.equal(mockContractParameters.purpose);
    });

    it("should throw error given missing obligatory input", () => {
      // act
      try {
        new Consent({} as ConsentParameters);
      } catch (e) {
        // missing "level", "scope" and "purpose"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }

      // act
      try {
        new Consent({
          dappIdentifier: "fake-dapp",
          //level: "read", // <-- missing level
          scope: "fakeScopeHash",
          purpose: "encrypted purpose message",
        } as ConsentParameters);
      } catch (e) {
        // missing "level"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }

      // act
      try {
        new Consent({
          dappIdentifier: "fake-dapp",
          level: "read",
          //scope: "fakeScopeHash", // <-- missing level
          purpose: "encrypted purpose message",
        } as ConsentParameters);
      } catch (e) {
        // missing "scope"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }

      // act
      try {
        new Consent({
          dappIdentifier: "fake-dapp",
          level: "read",
          scope: "fakeScopeHash",
          //purpose: "encrypted purpose message", // <-- missing purpose
        } as ConsentParameters);
      } catch (e) {
        // missing "purpose<"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }
    });

    it("should accept change of 'version' field", () => {
      // act
      instance = new Consent(mockContractParameters, 9999);
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
      instance = new Consent(mockContractParameters, 1, dHealthFake);
      const params: NetworkParameters = (instance as any).parameters;

      // assert
      expect(params.generationHash).to.be.equal("not-the-same-network");
    });
  });

  describe("body()", () => {
    beforeEach(() => {
      instance = new Consent(mockContractParameters);
    });

    it("should include 'level', 'scope' and 'purpose' fields", () => {
      // prepare
      instance = new Consent(mockContractParameters);

      // act
      const body: ObjectLiteral = instance.body;

      // assert
      expect("level" in body).to.be.equal(true);
      expect("scope" in body).to.be.equal(true);
      expect("purpose" in body).to.be.equal(true);
      expect(body.level).to.be.equal("read");
      expect(body.scope).to.be.equal("fakeScopeHash");
      expect(body.purpose).to.be.equal("encrypted purpose message");
    });
  });

  describe("toTransaction()", () => {
    beforeEach(() => {
      instance = new Consent(mockContractParameters);
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
