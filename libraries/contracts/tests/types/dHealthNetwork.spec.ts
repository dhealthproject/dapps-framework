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
import { ChronoUnit } from "@js-joda/core";
import { Deadline, NetworkType } from "@dhealth/sdk";

// internal dependencies
import { dHealthNetwork } from "@/types/dHealthNetwork";

// dHealth Network connection parameters (as expected)
const dHealth_networkType = NetworkType.MAIN_NET;
const dHealth_epochAdjustment = 1616978397;
const dHealth_currencyMosaicId = "39E0C49FA322A459";
const dHealth_generationHash =
  "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16";

describe("types/dHealthNetwork", () => {
  let instance: dHealthNetwork;

  describe("constructor()", () => {
    it("should use dHealth Network connection parameters", () => {
      // act
      instance = new dHealthNetwork();

      // assert
      expect(instance.networkType).to.be.equal(dHealth_networkType);
      expect(instance.epochAdjustment).to.be.equal(dHealth_epochAdjustment);
      expect(instance.currencyMosaicId).to.be.equal(dHealth_currencyMosaicId);
      expect(instance.generationHash).to.be.equal(dHealth_generationHash);
    });

    // should accept empty parameters
    it("should accept empty parameters and use dHealth Network", () => {
      // act
      instance = new dHealthNetwork({});

      // assert
      expect(instance.networkType).to.be.equal(dHealth_networkType);
      expect(instance.epochAdjustment).to.be.equal(dHealth_epochAdjustment);
      expect(instance.currencyMosaicId).to.be.equal(dHealth_currencyMosaicId);
      expect(instance.generationHash).to.be.equal(dHealth_generationHash);
    });

    it('should accept custom network through "generationHash"', () => {
      // act
      instance = new dHealthNetwork({ generationHash: "fake-id" });

      // assert
      expect(instance.generationHash).to.be.equal("fake-id");
    });
  });

  describe("getDeadline()", () => {
    beforeEach(() => {
      instance = new dHealthNetwork();
    });

    it("should create an instance using @dhealth/sdk's Deadline class", () => {
      // act
      const deadline: Deadline = instance.getDeadline();

      // assert
      expect(deadline instanceof Deadline).to.be.equal(true);
    });

    it("should accept custom unit value in first parameter", () => {
      // act
      const deadline1: Deadline = instance.getDeadline(1);
      const deadline2: Deadline = instance.getDeadline(2);

      // @todo overflow protection
      const asNumber1: number = parseInt(deadline1.toString());
      const asNumber2: number = parseInt(deadline2.toString());

      // assert
      expect(asNumber2).to.not.be.equal(asNumber1);
      expect(asNumber2).to.be.greaterThan(asNumber1);
    });

    it("should accept custom unit type in second parameter", () => {
      // act
      const deadline1: Deadline = instance.getDeadline(1, ChronoUnit.HOURS);
      const deadline2: Deadline = instance.getDeadline(2, ChronoUnit.MINUTES);

      // @todo overflow protection
      const asNumber1: number = parseInt(deadline1.toString());
      const asNumber2: number = parseInt(deadline2.toString());

      // assert
      expect(asNumber2).to.not.be.equal(asNumber1);
      // 2 minutes is less than 1 hour
      expect(asNumber2).to.be.lessThan(asNumber1);
    });

    it("should use deadline of '2 hours' given defaults", () => {
      // act
      const deadline1: Deadline = instance.getDeadline(1);
      const deadline2: Deadline = instance.getDeadline();
      const deadline3: Deadline = instance.getDeadline(3);

      // @todo overflow protection
      const asNumber1: number = parseInt(deadline1.toString());
      const asNumber2: number = parseInt(deadline2.toString());
      const asNumber3: number = parseInt(deadline3.toString());

      // assert
      expect(asNumber2).to.be.greaterThan(asNumber1);
      expect(asNumber2).to.be.lessThan(asNumber3);
      expect(asNumber2 - asNumber1).to.be.greaterThanOrEqual(
        1 * 60 * 60 * 1000 // 1 hour difference
      );
    });
  });
});
