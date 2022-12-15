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
import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { sha3_256 } from "js-sha3";

// internal dependencies
import { AuthenticationPayload, AuthService } from "../services/AuthService";
import { AccountSessionsService } from "../services/AccountSessionsService";
import {
  AccountSessionDocument,
  AccountSessionQuery,
} from "../models/AccountSessionSchema";

// configuration resources
import { AppConfiguration } from "../../AppConfiguration";
import { SecurityConfig } from "../models";

/**
 * @class RefreshStrategy
 * @description This trait implements a **passport strategy** that
 * refreshes a user's expired access tokens using **JwT tokens**
 * that are attached to the HTTP request *using a Bearer token header*.
 *
 * @todo Investigate whether a PEM-encoded public key makes more sense for *signing tokens* in production environments.
 * @since v0.3.0
 */
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  /**
   *
   */
  public constructor(
    private readonly accountSessionsService: AccountSessionsService,
  ) {
    super({
      // determines the *token* extraction method
      jwtFromRequest: ExtractJwt.fromExtractors([
        // do we have a refresh token in the request's *signed*
        // httpOnly cookies? (name: "dappName:Refresh")
        (request: Request) =>
          request?.signedCookies[AppConfiguration.dappName + ":Refresh"] ??
          null,

        // do we have a refresh token in the request's *unsigned*
        // httpOnly cookies? (name: "dappName:Refresh")
        (request: Request) =>
          request?.cookies[AppConfiguration.dappName + ":Refresh"] ?? null,

        // do we have a refresh token in Authorization header?
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      // defines a symmetric secret key for signing tokens
      secretOrKey: (AppConfiguration.getConfig("security") as SecurityConfig)
        .auth.secret,
      // permits to access the cookie from validate method
      passReqToCallback: true,
    });
  }

  /**
   * This method is called *internally* by Passport **after** having
   * validated a JwT token and is used merely to *decode* the data
   * of an already *authenticated* user.
   * <br /><br />
   * This method is **guaranteed to receive a valid token** that has
   * been previously *signed* and *issued* to a **valid** user.
   *
   * @param   {Record<string, any>}   payload   The valid token JSON object.
   * @returns
   */
  public async validate(
    request: Request,
    payload: Record<string, any>,
  ): Promise<AuthenticationPayload> {
    // extracts refresh token from *signed cookies*
    const refreshToken = AuthService.extractToken(
      request,
      `${AppConfiguration.dappName}:Refresh`,
    );

    // finds an `accounts` document using a SHA3-256
    // hash of the refresh token (never plain text).
    const account: AccountSessionDocument =
      await this.accountSessionsService.findOne(
        new AccountSessionQuery({
          address: payload.address,
          refreshTokenHash: sha3_256(refreshToken),
        } as AccountSessionDocument),
      );

    // re-build the authentication payload
    return {
      sub: account.lastSessionHash,
      address: account.address,
    } as AuthenticationPayload;
  }
}
