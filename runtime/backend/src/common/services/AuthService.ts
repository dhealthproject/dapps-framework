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
import { Request } from "express";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import {
  Address,
  Order,
  Transaction,
  TransactionGroup,
  TransactionType,
  TransferTransaction,
} from "@dhealth/sdk";

// internal dependencies
import { NetworkService } from "../services/NetworkService";
import { User } from "../models/User";

/**
 * 
 */
export interface CookiePayload {
  name: string;
  domain: string;
  secret: string;
}

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

  protected cookie: CookiePayload;
  protected challengeSize: number;

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
    private readonly networkService: NetworkService,
    private jwtService: JwtService,
  ) {
    const name = this.configService.get<string>("cookie.name");
    const domain = this.configService.get<string>("cookie.domain");
    const secret = this.configService.get<string>("auth.secret");

    // configures cookie(s) creation
    this.cookie = { name, domain, secret } as CookiePayload;
    this.challengeSize = this.configService.get<number>("auth.challengeSize");
  }

  /**
   * 
   * @param request 
   */
  public getCookie(): CookiePayload {
    return this.cookie;
  }

  /**
   * 
   * @param request 
   */
  public getChallenge(): string {
    // generates random number using greatest radix (36)
    // which serves numbers's representation in ASCII
    const size: number = this.challengeSize;
    return Math.random().toString(36).slice(-(size));
  }

  /**
   * 
   * @param address 
   * @returns {Promise<User|null>}
   * @throws {HttpException}
   */
  public async validate(
    address: string,
    authCode: string,
  ): Promise<User> {

    // initialize a connection to the node
    const nodeRequests = this.networkService.getTransactionRepository();

    // query latest 100 transactions
    // Caution: this is not SPAM-safe, a later iteration of this should
    // use the Discovery scope to discover authentication codes seamlessly
    const transactionPages = await Promise.all([
      nodeRequests.search({
        ...this.getTransactionQuery(),
        group: TransactionGroup.Unconfirmed,
      }).toPromise(),
      nodeRequests.search({
        ...this.getTransactionQuery(),
        group: TransactionGroup.Confirmed,
      }).toPromise(),
    ]);

    // reduces the returned transaction pages to one
    // flat array of **transfer** transactions
    let transactions: TransferTransaction[] = [];
    transactions = transactionPages.reduce(
      (prev, cur) => transactions.concat(
        cur.data.map(t => t as TransferTransaction)
      ), []);

    // responds with error if no transactions could be found at all
    // 401: Unauthorized
    if (! transactions.length) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    // searches the `authCode` in transfer message ("on-chain")
    // @todo make compatible with encrypted messages (decrypt with authority privkey)
    const authTransaction: TransferTransaction = transactions.find(
      (t: TransferTransaction) => t.message.payload === authCode
    );

    // responds with error if the `authCode` could **not** be found
    // 401: Unauthorized
    if (authTransaction === undefined) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    // @todo invalidate authCode after max 30 minutes? ("refresh QR?")
    // @todo store copy of accessToken + authCode?

    // returns the authorized user details
    return { id: address, name: address } as User;
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

  /**
   * 
   * @returns 
   */
  protected getTransactionQuery(): any {
    // get the account address from config
    const authAuthority = this.configService.get<string>("authAuthority");

    // returns a REST-compatible query
    return {
      recipientAddress: Address.createFromRawAddress(authAuthority),
      type: [TransactionType.TRANSFER],
      embedded: false,
      order: Order.Desc,
      pageNumber: 1,
      pageSize: 100,
    }
  }
}
