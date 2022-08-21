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
import { Referral, ReferralParameters } from "@/contracts/Referral";
import { MissingContractFieldError } from "@/errors/MissingContractFieldError";
import { dHealthNetwork } from "@/types/dHealthNetwork";

const mockAccountPublicKey =
  "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE";

describe("contracts/Referral", () => {
  let instance: Referral;

  describe("constructor()", () => {
    beforeEach(() => {
      instance = new Referral({
        dappIdentifier: "fake-dapp",
        refCode: "FAKE-REF",
      } as ReferralParameters);
    });

    it('should accept "refCode" input field', () => {
      // prepare
      instance = new Referral({
        dappIdentifier: "fake-dapp",
        refCode: "FAKE-REF",
      } as ReferralParameters);

      // act
      const inputs: ReferralParameters = (instance as any).inputs;

      // assert
      expect("refCode" in inputs).to.be.equal(true);
      expect(inputs.refCode).to.be.equal("FAKE-REF");
    });

    it('should throw error given missing "refCode" input', () => {
      // act
      try {
        new Referral({} as ReferralParameters);
      } catch (e) {
        // missing "refCode"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }
    });

    it('should accept change of "version" field', () => {
      // act
      instance = new Referral(
        {
          dappIdentifier: "fake-dapp",
          refCode: "ANOTHER_REF",
        } as ReferralParameters,
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
      instance = new Referral(
        {
          dappIdentifier: "fake-dapp",
          refCode: "A-THIRD-ref",
        } as ReferralParameters,
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
      instance = new Referral({
        dappIdentifier: "fake-dapp",
        refCode: "JOINUSNOW",
      } as ReferralParameters);
    });

    it('should include "refCode" field', () => {
      // prepare
      instance = new Referral({
        dappIdentifier: "fake-dapp",
        refCode: "JOINUSNOW",
      } as ReferralParameters);

      // act
      const body: ObjectLiteral = instance.body;

      // assert
      expect("refCode" in body).to.be.equal(true);
      expect(body.refCode).to.be.equal("JOINUSNOW");
    });
  });

  describe("toTransaction()", () => {
    beforeEach(() => {
      instance = new Referral({
        dappIdentifier: "fake-dapp",
        refCode: "JOINUSNOW",
      } as ReferralParameters);
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
