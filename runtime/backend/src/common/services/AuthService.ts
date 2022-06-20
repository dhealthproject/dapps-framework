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
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

// internal dependencies
import { User } from "../models/User";

/**
 * 
 */
export interface AuthenticationPayload {
  sub: string;
  address: string;
  //transactionHash: string;
}

/**
 * 
 */
export interface AuthenticationToken {
  accessToken: string;
  refreshToken: string;
}

/**
 * @class AuthService
 * @description This class serves as an *authentication handler* for users.
 * This can be used to *authenticate* the access to [a subset] of your dApp
 * routes and modules.
 *
 * @since v0.2.0
 */
@Injectable()
export class AuthService {
  /**
   * Constructs an instance of the network service and connects
   * to the **configured** `defaultNode` (config/network.json). Note
   * that connection handling is currently *automatic* and executed
   * upon instanciation of network service objects.
   *
   * @access public
   * @param {ConfigService} configService
   */
  public constructor(
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {
    //const defaultNode = this.configService.get<string>("defaultNode");
  }

  /**
   * 
   * @param address 
   * @returns {Promise<User|null>}
   */
  public async validate(
    address: string,
    authCode: string,
  ): Promise<User | null> {
    //XXX should read transaction from node
    //XXX if no authentication transaction found => return null
    //XXX returns transactionHash if valid

    console.log("got login request: ", { address, authCode });

    //XXX obviously remove dummy data
    return {
      id: "NCYJOGGKJUOPFJXJPSXBVMMSWEYX4HW3KGJUTTA",
      name: "NCYJOGGKJUOPFJXJPSXBVMMSWEYX4HW3KGJUTTA"
    } as User;
  }

  /**
   * 
   * @param address 
   */
  public async getAccessToken(user: User): Promise<AuthenticationToken> {
    // constructs the JwT token payload (it will then be *signed*)
    const payload: AuthenticationPayload = { sub: user.id, address: user.name };

    console.log("creating token for: ", { user });

    return { accessToken: this.jwtService.sign(payload, {
      // defines a symmetric secret key for signing tokens
      secret: process.env.AUTH_TOKEN_SECRET,
      expiresIn: "1h"
    }) } as AuthenticationToken;
  }
}
