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
import type { ObjectLiteral } from "@/types/ObjectLiteral";
import type { NetworkParameters } from "@/types/NetworkParameters";
import type { TransactionParameters } from "@/types/TransactionParameters";
import { Auth, AuthParameters } from "@/contracts/Auth";
import { MissingContractFieldError } from "@/errors/MissingContractFieldError";
import { dHealthNetwork } from "@/types/dHealthNetwork";

const mockAccountPublicKey =
  "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE";

describe("contracts/Auth", () => {
  let instance: Auth;

  describe("constructor()", () => {
    beforeEach(() => {
      instance = new Auth({
        dappIdentifier: "fake-dapp",
        challenge: "no-challenge",
      } as AuthParameters);
    });

    it('should accept "challenge" input field', () => {
      // prepare
      instance = new Auth({
        dappIdentifier: "fake-dapp",
        challenge: "another-challenge",
      } as AuthParameters);

      // act
      const inputs: AuthParameters = (instance as any).inputs;

      // assert
      expect("challenge" in inputs).to.be.equal(true);
      expect(inputs.challenge).to.be.equal("another-challenge");
    });

    it('should throw error given missing "challenge" input', () => {
      // act
      try {
        new Auth({} as AuthParameters);
      } catch (e) {
        // missing "challenge"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }
    });

    it('should accept change of "version" field', () => {
      // act
      instance = new Auth(
        {
          dappIdentifier: "fake-dapp",
          challenge: "another-challenge",
        } as AuthParameters,
        9999
      );
      const header: ObjectLiteral = instance.header;

      // assert
      expect(header.version).to.be.equal(9999);
    });

    it("should accept change of network parameters", () => {
      // prepare
      const dHealthFake = new dHealthNetwork();
      dHealthFake.generationHash = "not-the-same-network";

      // act
      instance = new Auth(
        {
          dappIdentifier: "fake-dapp",
          challenge: "another-challenge",
        } as AuthParameters,
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
      instance = new Auth({
        dappIdentifier: "fake-dapp",
        challenge: "no-challenge",
      } as AuthParameters);
    });

    it('should include "challenge" field', () => {
      // prepare
      instance = new Auth({
        dappIdentifier: "fake-dapp",
        challenge: "another-challenge",
      } as AuthParameters);

      // act
      const body: ObjectLiteral = instance.body;

      // assert
      expect("challenge" in body).to.be.equal(true);
      expect(body.challenge).to.be.equal("another-challenge");
    });

    it('should include "refCode" given it is non-empty', () => {
      // prepare
      instance = new Auth({
        dappIdentifier: "fake-dapp",
        challenge: "another-challenge",
        refCode: "this-works",
      } as AuthParameters);

      // act
      const body: ObjectLiteral = instance.body;

      // assert
      expect("refCode" in body).to.be.equal(true);
      expect(body.refCode).to.be.equal("this-works");
    });
  });

  describe("toTransaction()", () => {
    beforeEach(() => {
      instance = new Auth({
        dappIdentifier: "fake-dapp",
        challenge: "no-challenge",
      } as AuthParameters);
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
  });
});
