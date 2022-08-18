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

// internal dependencies
import { Account } from "../models/AccountSchema";

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
  public constructor() {
    super({
      // determines the *token* extraction method
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // delegates the validation of expiry to Passport
      ignoreExpiration: false,
      // defines a symmetric secret key for signing tokens
      secretOrKey: process.env.AUTH_TOKEN_SECRET,
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
  public async validate(payload: Record<string, any>): Promise<Account> {
    const account = new Account();
    account.address = payload.address;
    return account;
  }
}