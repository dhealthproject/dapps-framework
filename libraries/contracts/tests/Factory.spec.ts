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
import { EmptyMessage, PlainMessage, TransferTransaction } from "@dhealth/sdk";

// internal dependencies
import type { NetworkParameters } from "../src/types/NetworkParameters";
import { Contract } from "../src/Contract";
import { dHealthNetwork } from "../src/types/dHealthNetwork";
import { Factory } from "../src/Factory";
import { InvalidContractError } from "../src/errors/InvalidContractError";
import { MissingContractFieldError } from "../src/errors/MissingContractFieldError";
import { UnknownContractError } from "../src/errors/UnknownContractError";

const mockAccountPublicKey =
  "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE";

// utility transaction factory
const transferFactory = (
  message: string | PlainMessage
): TransferTransaction => {
  const networkConfig: NetworkParameters = new dHealthNetwork();
  const parsedMsg =
    message instanceof PlainMessage ? message : PlainMessage.create(message);

  return TransferTransaction.create(
    networkConfig.getDeadline(),
    networkConfig.getPublicAccount(
      mockAccountPublicKey,
      networkConfig.getNetworkType()
    ).address,
    [],
    parsedMsg,
    networkConfig.getNetworkType()
  );
};

describe("Factory", () => {
  describe("createFromTransaction()", () => {
    const emptyMessageTransfer = transferFactory(EmptyMessage);

    it("should throw error given missing 'message' in transfer", () => {
      // act
      try {
        Factory.createFromTransaction(emptyMessageTransfer);
      } catch (e) {
        // empty "message"
        // assert
        expect(e instanceof InvalidContractError).to.be.equal(true);
        expect((e as InvalidContractError).message).to.be.equal(
          "A contract payload (JSON) is missing."
        );
      }
    });

    it("should throw error given missing 'contract' field", () => {
      // act
      try {
        Factory.createFromTransaction(
          transferFactory(
            JSON.stringify({
              missing: "the contract field",
              version: 1,
            })
          )
        );
      } catch (e) {
        // missing "contract"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }
    });

    it("should throw error given missing 'version' field", () => {
      // act
      try {
        Factory.createFromTransaction(
          transferFactory(
            JSON.stringify({
              missing: "the version field",
              contract: "awesome-dapp:fake-contract",
            })
          )
        );
      } catch (e) {
        // missing "version"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }
    });

    it("should throw error given unsupported contract signature", () => {
      // act
      try {
        Factory.createFromTransaction(
          transferFactory(
            JSON.stringify({
              contract: "awesome-dapp:this-contract-does-not-exist",
              version: 1,
            })
          )
        );
      } catch (e) {
        // contract not supported
        // assert
        expect(e instanceof UnknownContractError).to.be.equal(true);
      }
    });

    // this block can also be used as an example for *obligatory*
    // fields to parse JSON payloads that create supported contracts
    // @todo always add newly supported contracts here
    [
      { identifier: "auth", v: 1, inputs: { challenge: "abcdef12" } },
      { identifier: "earn", v: 1, inputs: { date: "20220829" } },
      { identifier: "referral", v: 1, inputs: { refCode: "ELEVATE2022" } },
      {
        identifier: "welcome",
        v: 1,
        inputs: { message: "Hello and welcome!" },
      },
    ].forEach((contract) => {
      it(`should create instance of supported Contract child class for '${contract.identifier}'`, () => {
        // prepare
        const fields = Object.keys(contract.inputs);

        // act
        const instance: Contract = Factory.createFromTransaction(
          transferFactory(
            JSON.stringify({
              contract: `awesome-dapp:${contract.identifier}`,
              version: contract.v,
              ...contract.inputs,
            })
          )
        );
        const asJSON = instance.toJSON();
        const parsed = JSON.parse(asJSON);

        // assert
        expect(instance.identifier).to.be.equal(contract.identifier);
        fields.forEach((f) => expect(f in parsed).to.be.equal(true));
      });
    });
  });

  describe("createFromJSON()", () => {
    it("should throw error given missing 'contract' field", () => {
      // act
      try {
        Factory.createFromJSON(
          JSON.stringify({
            missing: "the contract field",
            version: 1,
          })
        );
      } catch (e) {
        // missing "contract"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }
    });

    it("should throw error given missing 'version' field", () => {
      // act
      try {
        Factory.createFromJSON(
          JSON.stringify({
            missing: "the version field",
            contract: "awesome-dapp:fake-contract",
          })
        );
      } catch (e) {
        // missing "version"
        // assert
        expect(e instanceof MissingContractFieldError).to.be.equal(true);
      }
    });

    it("should throw error given unsupported contract signature", () => {
      // act
      try {
        Factory.createFromJSON(
          JSON.stringify({
            contract: "awesome-dapp:this-contract-does-not-exist",
            version: 1,
          })
        );
      } catch (e) {
        // contract not supported
        // assert
        expect(e instanceof UnknownContractError).to.be.equal(true);
      }
    });

    // this block can also be used as an example for *obligatory*
    // fields to parse JSON payloads that create supported contracts
    // @todo always add newly supported contracts here
    [
      { identifier: "auth", v: 1, inputs: { challenge: "abcdef12" } },
      { identifier: "earn", v: 1, inputs: { date: "20220829" } },
      { identifier: "referral", v: 1, inputs: { refCode: "ELEVATE2022" } },
      {
        identifier: "welcome",
        v: 1,
        inputs: { message: "Hello and welcome!" },
      },
    ].forEach((contract) => {
      it(`should create instance of supported Contract child class for '${contract.identifier}'`, () => {
        // prepare
        const fields = Object.keys(contract.inputs);

        // act
        const instance: Contract = Factory.createFromJSON(
          JSON.stringify({
            contract: `awesome-dapp:${contract.identifier}`,
            version: contract.v,
            ...contract.inputs,
          })
        );
        const asJSON = instance.toJSON();
        const parsed = JSON.parse(asJSON);

        // assert
        expect(instance.identifier).to.be.equal(contract.identifier);
        fields.forEach((f) => expect(f in parsed).to.be.equal(true));
      });
    });
  });
});
