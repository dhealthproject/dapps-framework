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
import { AccountDocument, AccountQuery } from "../models/AccountSchema";
import { AccountsService } from "../services/AccountsService";
import { AuthenticationPayload, AuthService } from "../services/AuthService";

// configuration resources
import dappConfigLoader from "../../../config/dapp";
import securityConfigLoader from "../../../config/security";
const conf = dappConfigLoader();
const auth = securityConfigLoader().auth;

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
  public constructor(private readonly accountsService: AccountsService) {
    super({
      // determines the *token* extraction method
      jwtFromRequest: ExtractJwt.fromExtractors([
        // do we have a refresh token in the request's *signed*
        // httpOnly cookies? (name: "dappName:Refresh")
        (request: Request) =>
          request?.signedCookies[conf.dappName + ":Refresh"] ?? null,

        // do we have a refresh token in the request's *unsigned*
        // httpOnly cookies? (name: "dappName:Refresh")
        (request: Request) =>
          request?.cookies[conf.dappName + ":Refresh"] ?? null,

        // do we have a refresh token in Authorization header?
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      // defines a symmetric secret key for signing tokens
      secretOrKey: auth.secret,
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
      `${conf.dappName}:Refresh`,
    );

    // finds an `accounts` document using a SHA3-256
    // hash of the refresh token (never plain text).
    const account: AccountDocument = await this.accountsService.findOne(
      new AccountQuery({
        address: payload.address,
        refreshTokenHash: sha3_256(refreshToken),
      } as AccountDocument),
    );

    // re-build the authentication payload
    return {
      sub: account.lastSessionHash,
      address: account.address,
    } as AuthenticationPayload;
  }
}
