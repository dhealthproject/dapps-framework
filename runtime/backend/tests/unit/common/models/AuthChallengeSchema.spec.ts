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
import { AuthChallengeDTO } from "../../../../src/common/models/AuthChallengeDTO";
import { AuthChallenge, AuthChallengeDocument, AuthChallengeQuery } from "../../../../src/common/models/AuthChallengeSchema";

describe("common/AuthChallengeSchema", () => {
  describe("toQuery() -->", () => {
    it("should return correct value", () => {
      // prepare
      const challenge = "test-challenge";
      const authChallenge: AuthChallenge = new AuthChallenge();
      (authChallenge as any).challenge = challenge;

      // act
      const accountToQuery = authChallenge.toQuery;

      // assert
      expect(accountToQuery).toEqual({ challenge });
    });
  });

  describe("fillDTO() -->", () => {
    it("should return correct instance", () => {
      // prepare
      const challenge = "test-challenge";
      const authChallenge: AuthChallenge = new AuthChallenge();
      (authChallenge as any).challenge = challenge;
      const expectedResult = { challenge };

      // act
      const result = AuthChallenge.fillDTO(
        authChallenge as AuthChallengeDocument,
        {} as AuthChallengeDTO
      );

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});

describe("common/AuthChallengeQuery", () => {
  describe("constructor() -->", () => {
    it("should created correct instance with default queryParameters", () => {
      // prepare
      const authChallengeDocument = {
        challenge: "test-challenge"
      } as AuthChallengeDocument;

      // act
      const authChallengeQuery = new AuthChallengeQuery(
        authChallengeDocument,
      );

      // assert
      expect(authChallengeQuery.document).toEqual(authChallengeDocument);
      expect(authChallengeQuery.pageNumber).toEqual(1);
      expect(authChallengeQuery.pageSize).toEqual(20);
      expect(authChallengeQuery.sort).toEqual("_id");
      expect(authChallengeQuery.order).toEqual("asc");
    });

    it("should created correct instance with specified queryParameters", () => {
      // prepare
      const authChallengeDocument = {
        challenge: "test-challenge"
      } as AuthChallengeDocument;
      const queryParameters = {
        pageNumber: 1,
        pageSize: 1,
        sort: "challenge",
        order: "desc"
      };

      // act
      const authChallengeQuery = new AuthChallengeQuery(
        authChallengeDocument,
        queryParameters
      );

      // assert
      expect(authChallengeQuery.document).toEqual(authChallengeDocument);
      expect(authChallengeQuery.pageNumber).toEqual(queryParameters.pageNumber);
      expect(authChallengeQuery.pageSize).toEqual(queryParameters.pageSize);
      expect(authChallengeQuery.sort).toEqual(queryParameters.sort);
      expect(authChallengeQuery.order).toEqual(queryParameters.order);
    });
  });
});