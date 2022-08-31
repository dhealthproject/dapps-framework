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
import { PlainMessage } from "@dhealth/sdk";
import { Contract, Factory } from "@dhealth/contracts";

/**
 *
 */
export const getOperation = (plainMessage: PlainMessage | string): Contract => {
  // flatten plain message to a string
  const plain: string =
    plainMessage instanceof PlainMessage ? plainMessage.payload : plainMessage;

  // the following block interprets the content of the transfer
  // transaction message. In case of encrypted transfer message
  // we assume that the *decryption has already taken place*.

  // (1) Health2Earn v0 messages for the `elevate:earn` contract
  //     include only a date representation. Note that with v0
  //     `elevate:earn` was called only *once on a daily basis*.
  if (plain.match(/^[0-9]{8}$/)) {
    // e.g. "20220818", "20211201"
    return Factory.createFromJSON(
      JSON.stringify({
        contract: "elevate:earn",
        version: 0,
        date: plain,
      }),
    );
  }

  // (2) Starting with ELEVATE and any other dApps after that,
  //     contracts are represented using JSON payloads which we
  //     attach to transfer transaction messages
  else if (plain.match(/^\{/) && plain.match(/\}$/)) {
    // the following *may* throw an error given invalid JSON
    // e.g. "{ contract: '' }"
    return Factory.createFromJSON(plain);
  }

  // (3) We could not determine a *supported* contract signature
  //     and cannot create an instance of `Contract`. This operation
  //     is currently not supported.
  return null;
};

/**
 * @function getOperationType
 * @description This helper function parses a transfer transaction
 * message into an *operation type*, a.k.a "a contract identifier".
 * <br /><br />
 * For purposes of backwards compatibility, this function permits
 * to parse **Health2Earn v0** messages as well and maps them to
 * the `elevate:earn` operation type.
 *
 * @since v0.3.0
 */
export const getOperationType = (
  plainMessage: PlainMessage | string,
): string => {
  // flatten plain message to a string
  const plain: string =
    plainMessage instanceof PlainMessage ? plainMessage.payload : plainMessage;

  // fallback to "base" if we can't read a payload
  if (undefined === plain || !plain.length) {
    return "elevate:base";
  }

  const operation: Contract = getOperation(plainMessage);

  // @todo add `elevate:referral` and `elevate:welcome`
  // @todo make sure to cover every type of contract that could be passed here
  // @todo the above must be *thoroughly tested* to make sure

  return operation === null ? "elevate:base" : operation.signature;
};
