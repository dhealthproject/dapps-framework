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
import {
  EmptyMessage,
  PlainMessage,
  Transaction,
  TransferTransaction,
} from "@dhealth/sdk";

// internal dependencies
import type { ObjectLiteral } from "@/types/ObjectLiteral";
import type { TransactionParameters } from "@/types/TransactionParameters";
import type { NetworkParameters } from "@/types/NetworkParameters";
import { Contract } from "@/Contract";
import { dHealthNetwork } from "@/types/dHealthNetwork";
import { InvalidContractError } from "@/errors/InvalidContractError";
import { MissingContractFieldError } from "@/errors/MissingContractFieldError";
import { UnknownContractError } from "@/errors/UnknownContractError";

const mockAccountPublicKey =
  "71BC0DB348A25D163290C44EF863B031FD5251D4E3674DCE37D78FE6C5F8E0FE";

// mocks a *fake* implementation of the abstract
// `Contract` class, to test internal methods
class FakeContractMock extends Contract {
  // mocks to permits version change
  constructor(version?: number) {
    super({ dappIdentifier: "fake-dapp" }, version);
  }

  // mocks a body implementation
  public get body(): ObjectLiteral {
    return { fakeKey: "fake-value" };
  }

  // mocks an identifier implementation
  public get identifier(): string {
    return "fake-contract";
  }

  // mocks a transaction factory implementation
  public toTransaction(parameters: TransactionParameters): Transaction {
    return { ...parameters } as any as Transaction;
  }
}

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

describe("Contract", () => {
  let instance: FakeContractMock = new FakeContractMock();

  describe("constructor()", () => {
    it("should default to version 1", () => {
      // act
      instance = new FakeContractMock(undefined);
      const header: ObjectLiteral = instance.header;

      // assert
      expect(header).to.not.be.undefined;
      expect("version" in header).to.be.equal(true);
      expect(header.version).to.be.equal(1);
    });

    it("should allow updating the 'version' field", () => {
      // act
      instance = new FakeContractMock(9999);
      const header: ObjectLiteral = instance.header;

      // assert
      expect(header).to.not.be.undefined;
      expect("version" in header).to.be.equal(true);
      expect(header.version).to.be.equal(9999);
    });
  });

  describe("header()", () => {
    beforeEach(() => {
      instance = new FakeContractMock();
    });

    it("should define correct dApp information", () => {
      // act
      const header: ObjectLiteral = instance.header;

      // assert
      expect(header).to.not.be.undefined;
      expect("contract" in header).to.be.equal(true);
      expect("version" in header).to.be.equal(true);
      expect(header.contract).to.not.be.undefined;
      expect(header.version).to.not.be.undefined;
    });

    it("should use correct values for dApp information", () => {
      // act
      const header: ObjectLiteral = instance.header;

      // assert
      expect(header.contract).to.not.be.undefined;
      expect(header.contract).to.be.equal("fake-dapp:fake-contract");
    });

    it("should permit to overwrite the version field", () => {
      // prepare
      const contract: FakeContractMock = new FakeContractMock(2); // version=2

      // act
      const header: ObjectLiteral = contract.header;

      // assert
      expect(header.version).to.not.be.undefined;
      expect(header.version).to.be.equal(2);
    });
  });

  describe("dApp()", () => {
    beforeEach(() => {
      instance = new FakeContractMock();
    });

    it("should replace spaces by hyphens", () => {
      // prepare
      (instance as any).inputs.dappIdentifier = "this will be hyphenated";

      // act
      const dApp: string = (instance as any).dApp;

      // assert
      expect(dApp).to.be.equal("this-will-be-hyphenated");
    });

    it("should remove undesired characters", () => {
      // prepare
      (instance as any).inputs.dappIdentifier = "this#is#not#-all.owed";

      // act
      const dApp: string = (instance as any).dApp;

      // assert
      expect(dApp).to.be.equal("thisisnot-all.owed");
    });

    it("should keep alpha-numerical values", () => {
      // prepare
      (instance as any).inputs.dappIdentifier = "this-1-is-allowed.com";

      // act
      const dApp: string = (instance as any).dApp;

      // assert
      expect(dApp).to.be.equal("this-1-is-allowed.com");
    });

    it("should allow uppercase but execute toLowercase", () => {
      // prepare
      (instance as any).inputs.dappIdentifier = "this-1-is-ALSO-allowed";

      // act
      const dApp: string = (instance as any).dApp;

      // assert
      expect(dApp).to.be.equal("this-1-is-also-allowed");
    });

    it("should replace multi-hyphens by single hyphen", () => {
      // prepare
      (instance as any).inputs.dappIdentifier = "this-1---is-##no#t#-allo##wed";

      // act
      const dApp: string = (instance as any).dApp;

      // assert
      expect(dApp).to.be.equal("this-1-is-not-allowed");
    });
  });

  describe("toJSON()", () => {
    beforeEach(() => {
      instance = new FakeContractMock();
    });

    it("should contain fields 'contract' and 'version'", () => {
      // act
      const json: string = instance.toJSON();
      const parsed: ObjectLiteral = JSON.parse(json);

      // assert
      expect(parsed).to.not.be.undefined;
      expect("contract" in parsed).to.be.equal(true);
      expect("version" in parsed).to.be.equal(true);
      expect(parsed.contract).to.be.equal("fake-dapp:fake-contract");
      expect(parsed.version).to.be.equal(1);
    });

    it("should use updated 'version' field", () => {
      // prepare
      instance = new FakeContractMock(9999);

      // act
      const json: string = instance.toJSON();
      const parsed: ObjectLiteral = JSON.parse(json);

      // assert
      expect(parsed).to.not.be.undefined;
      expect("version" in parsed).to.be.equal(true);
      expect(parsed.version).to.be.equal(9999);
    });

    it("should use updated dApp name for 'contract'", () => {
      // prepare
      (instance as any).inputs.dappIdentifier = "new-dapp-identifier";

      // act
      const json: string = instance.toJSON();
      const parsed: ObjectLiteral = JSON.parse(json);

      // assert
      expect(parsed).to.not.be.undefined;
      expect(parsed.contract).to.be.equal("new-dapp-identifier:fake-contract");
    });

    it("should contain custom body fields", () => {
      // act
      const json: string = instance.toJSON();
      const parsed: ObjectLiteral = JSON.parse(json);

      // assert
      expect(parsed).to.not.be.undefined;
      expect("fakeKey" in parsed).to.be.equal(true);
      expect(parsed.fakeKey).to.be.equal("fake-value");
    });
  });

  describe("fromTransaction()", () => {
    const emptyMessageTransfer = transferFactory(EmptyMessage);

    it("should throw error given missing 'message' in transfer", () => {
      // act
      try {
        Contract.fromTransaction(emptyMessageTransfer);
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
        Contract.fromTransaction(
          transferFactory(
            JSON.stringify({
              version: 1,
              challenge: "abcdef12",
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
        Contract.fromTransaction(
          transferFactory(
            JSON.stringify({
              contract: "awesome-dapp:fake-contract",
              challenge: "abcdef12",
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
        Contract.fromTransaction(
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
      it(`should create payload of supported Contract child class for '${contract.identifier}'`, () => {
        // prepare
        const fields = Object.keys(contract.inputs);

        // act
        const parsed: ObjectLiteral = Contract.fromTransaction(
          transferFactory(
            JSON.stringify({
              contract: `awesome-dapp:${contract.identifier}`,
              version: contract.v,
              ...contract.inputs,
            })
          )
        );

        // assert
        expect(parsed.contract).to.be.equal(
          `awesome-dapp:${contract.identifier}`
        );
        fields.forEach((f) => expect(f in parsed).to.be.equal(true));
      });
    });
  });
});
