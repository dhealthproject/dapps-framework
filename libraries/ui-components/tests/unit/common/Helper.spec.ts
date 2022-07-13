/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Unit Tests
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { expect } from "chai";
import sinon from 'sinon';

// internal dependencies
import { Helper } from '@/common/Helper';

describe('Helper -->', () => {
  const sandbox = sinon.createSandbox();
  let consoleErrorStub: sinon.SinonStub;

  beforeEach(() => {
    consoleErrorStub = sandbox.stub(console, "error");
  });

  afterEach(() => {
    sandbox.restore()
  });

  describe('test on getColorFromHash()', async () => {
    it("should print error to console and return correct result when hash contains less than 3 characters", () => {
      const hashParam = "ab";
      const result = Helper.getColorFromHash(hashParam);
      expect(
        consoleErrorStub.calledWith("Failed to convert hash to color. Hash string length < 3")
      ).to.be.true;
      expect(result).to.deep.equal({
        R: 0,
        G: 0,
        B: 0,
      });
    });

    it("should have correct flow & result when isHex = true", () => {
      const hashParam = "abcdefghi";
      const mathTruncStub = sandbox
        .stub(Math, "trunc")
        .returns(3);
      const substringStub = sandbox
        .stub(String.prototype, "substring")
        .onCall(0).returns("abc")
        .onCall(1).returns("def")
        .onCall(2).returns("ghi");
      const hexToRGBStub = sandbox
        .stub(Helper, "hexToRGB")
        .onCall(0).returns(0)
        .onCall(1).returns(1)
        .onCall(2).returns(2);
      const result = Helper.getColorFromHash(hashParam, true);
      expect(mathTruncStub.calledOnce).to.be.true;
      expect(substringStub.calledThrice).to.be.true;
      expect(hexToRGBStub.calledThrice).to.be.true;
      expect(result).to.deep.equal({R: 0, G: 1, B: 2});
    });

    it("should have correct flow & result when isHex = false", () => {
      const hashParam = "abcdefghi";
      const mathTruncStub = sandbox
        .stub(Math, "trunc")
        .returns(3);
      const substringStub = sandbox
        .stub(String.prototype, "substring")
        .onCall(0).returns("abc")
        .onCall(1).returns("def")
        .onCall(2).returns("ghi")
        .onCall(3).returns("cde");
      const charsetToRGBStub = sandbox
        .stub(Helper, "charsetToRGB")
        .onCall(0).returns(0)
        .onCall(1).returns(1)
        .onCall(2).returns(2);
      const result = Helper.getColorFromHash(hashParam, false);
      expect(mathTruncStub.calledOnce).to.be.true;
      expect(substringStub.callCount === 4).to.be.true;
      expect(charsetToRGBStub.calledThrice).to.be.true;
      expect(result).to.deep.equal({R: 0, G: 1, B: 2});
    });
  });

  describe("test on hexToRGB()", () => {
    it("should have correct flow and result", () => {
      const parseIntStub = sandbox
        .stub(global, "parseInt")
        .onFirstCall().returns(1)
        .onSecondCall().returns(2)
        .onThirdCall().returns(3);
      const expectedResult = 34;
      const result = Helper.hexToRGB("abc");
      expect(parseIntStub.callCount === 3).to.be.true;
      expect(result).to.equals(expectedResult);
    });
  });

  describe("test on charsetToRGB()", () => {
    it("should have correct result", () => {
      const expectedResult = 80;
      const result = Helper.charsetToRGB("abc");
      expect(result).to.equals(expectedResult);
    });
  });

  describe("test on truncString()", () => {
    it("should return input when input length is not greater than `strLen` * 2", () => {
      const str = "abc"; // length 3
      const strLen = 2;
      const result = Helper.truncString(str, strLen);
      expect(result).to.equals(str);
    });

    it("should return correct result", () => {
      const str = "abcdefghi"; // length 9
      const expectedResult = "abcd...fghi";
      const strLen = 4;
      const result = Helper.truncString(str, strLen);
      expect(result).to.equals(expectedResult);
    });
  });
});