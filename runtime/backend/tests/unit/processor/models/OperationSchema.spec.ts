/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { OperationDTO } from "../../../../src/processor/models/OperationDTO";
import { Operation, OperationDocument, OperationQuery } from "../../../../src/processor/models/OperationSchema";

describe("processor/OperationSchema", () => {
  describe("toQuery()", () => {
    it("should return correct value", () => {
      // prepare
      const userAddress = "test-userAddress";
      const transactionHash = "test-transactionHash";
      const contractSignature = "test-contractSignature";
      const operation: Operation = new Operation();
      (operation as any).userAddress = userAddress;
      (operation as any).transactionHash = transactionHash;
      (operation as any).contractSignature = contractSignature;

      // act
      const stateToQuery = operation.toQuery;

      // assert
      expect(stateToQuery).toEqual({ userAddress, transactionHash, contractSignature });
    });
  });

  describe("fillDTO()", () => {
    it("should return correct instance", () => {
      // prepare
      const userAddress = "test-userAddress";
      const transactionHash = "test-transactionHash";
      const contractSignature = "test-contractSignature";
      const creationBlock = "test-creationBlock";
      const operation: Operation = new Operation();
      (operation as any).userAddress = userAddress;
      (operation as any).transactionHash = transactionHash;
      (operation as any).contractSignature = contractSignature;
      (operation as any).creationBlock = creationBlock;
      const expectedResult = { userAddress, transactionHash, contractSignature, creationBlock };

      // act
      const result = Operation.fillDTO(operation as OperationDocument, new OperationDTO());

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});

describe("processor/OperationQuery", () => {
  it("should be defined", () => {
    expect(new OperationQuery()).toBeDefined();
  });
});