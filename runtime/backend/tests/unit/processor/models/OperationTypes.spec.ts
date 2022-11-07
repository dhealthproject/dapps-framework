/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Factory } from "@dhealth/contracts";
import { PlainMessage } from "@dhealth/sdk";

// internal dependencies
import { getOperation, getOperationType } from "../../../../src/processor/models/OperationTypes";

describe("processor/OperationTypes", () => {
  describe("getOperation()", () => {
    it("should call correct methods and return correct result with string message", () => {
      // prepare
      const plainMessage = "20220101";

      // act
      const result = getOperation(
        plainMessage
      );

      // assert
      expect(result).toEqual(Factory.createFromJSON(
        JSON.stringify({
          contract: "elevate:earn",
          version: 0,
          date: plainMessage,
        })
      ));
    });

    it("should call correct methods and return correct result with PlainMessage message", () => {
      // prepare
      const plainMessage = new PlainMessage();
      (plainMessage as any).payload = "20220101";

      // act
      const result = getOperation(
        plainMessage
      );

      // assert
      expect(result).toEqual(Factory.createFromJSON(
        JSON.stringify({
          contract: "elevate:earn",
          version: 0,
          date: plainMessage.payload,
        })
      ));
    });

    it("should call correct methods and return correct result with object message", () => {
      // prepare
      const plainMessage = {
        contract: "elevate:earn",
        version: 0,
        date: "20220101",
      };

      // act
      const result = getOperation(
        JSON.stringify(plainMessage)
      );

      // assert
      expect(result).toEqual(Factory.createFromJSON(plainMessage));
    });
  });

  describe("getOperationType()", () => {
    it("should return `elevate:base` if cannot find operation", () => {
      // prepare
      const plainMessage = "test-message";
      const expectedResult = "elevate:base";

      // act
      const result = getOperationType(plainMessage);

      // assert
      expect(result).toBe(expectedResult);
    });

    it("should return `elevate:base` if plainMessage is undefined or empty", () => {
      // prepare
      const msgs = [undefined, ""];
      const expectedResult = "elevate:base";
      msgs.forEach((msg) => {

        // act
        const result = getOperationType(msg);
  
        // assert
        expect(result).toBe(expectedResult);  
      });
    });
  });

  it("should return signature from operation if an operation was found", () => {
    // prepare
    const plainMessage = new PlainMessage();
    (plainMessage as any).payload = "20220101";

    // act
    const result = getOperationType(plainMessage);

    // assert
    expect(result).toEqual("elevate:earn");
  });
});