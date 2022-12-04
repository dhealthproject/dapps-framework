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

// internal dependencies
import { AccountDocument, AccountQuery } from "../models/AccountSchema";
import { AccountsService } from "../services/AccountsService";
import { AuthenticationPayload } from "../services/AuthService";

// configuration resources
import dappConfigLoader from "../../../config/dapp";
import securityConfigLoader from "../../../config/security";
import {
  AccountSessionDocument,
  AccountSessionQuery,
} from "../models/AccountSessionSchema";
import { AccountSessionsService } from "../services/AccountSessionsService";
const conf = dappConfigLoader();
const auth = securityConfigLoader().auth;

/**
 * @class AuthStrategy
 * @description This trait implements a **passport strategy** that
 * authenticates users using **JwT tokens** that are attached to the HTTP
 * request *using a Bearer token header*.
 *
 * @todo Investigate whether a PEM-encoded public key makes more sense for *signing tokens* in production environments.
 * @since v0.2.0
 */
@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
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
        (request: Request) => request?.signedCookies[conf.dappName] ?? null,

        // do we have a refresh token in the request's *unsigned*
        // httpOnly cookies? (name: "dappName:Refresh")
        (request: Request) => request?.cookies[conf.dappName] ?? null,

        // enables `Authorization` header
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      // delegates the validation of expiry to Passport
      ignoreExpiration: false,
      // defines a symmetric secret key for signing tokens
      secretOrKey: auth.secret,
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
    // finds an `accounts` document that corresponds
    // the authentication payload's dHealth address.
    const accountSession: AccountSessionDocument =
      await this.accountSessionsService.findOne(
        new AccountSessionQuery({
          address: payload.address,
          sub: payload.sub,
        } as AccountSessionDocument),
      );

    // re-build the authentication payload
    return {
      sub: accountSession.lastSessionHash,
      address: accountSession.address,
    } as AuthenticationPayload;
  }
}
