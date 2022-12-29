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
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { sha3_256 } from "js-sha3";
import {
  Address,
  Order,
  Page,
  Transaction,
  TransactionGroup,
  TransactionSearchCriteria,
  TransactionType,
  TransferTransaction,
} from "@dhealth/sdk";
import { Auth, Contract, Factory } from "@dhealth/contracts";
import { Request } from "express";

// internal dependencies
import { NetworkService } from "./NetworkService";
import { LogService } from "./LogService";
import { AccountsService } from "./AccountsService";
import { ChallengesService } from "./ChallengesService";
import { AppConfiguration } from "../../AppConfiguration";
import { AccountDocument, AccountQuery } from "../models/AccountSchema";
import { AccessTokenDTO } from "../models/AccessTokenDTO";
import {
  AuthChallengeDocument,
  AuthChallengeQuery,
} from "../models/AuthChallengeSchema";
import {
  AccountSessionDocument,
  AccountSessionQuery,
} from "../models/AccountSessionSchema";
import { AccountSessionsService } from "./AccountSessionsService";
import { AuthGateway } from "../gateways/AuthGateway";

// configuration resources
import dappConfigLoader from "../../../config/dapp";
import { AccessTokenRequest } from "../requests/AccessTokenRequest";
const conf = dappConfigLoader();

/**
 * @interface CookiePayload
 * @description This type is used to describe an individual cookie
 * instance as forwarded to the frontend runtime. Cookies that are
 * created by the backend runtime are *always signed* using a auth
 * secret.
 * <br /><br />
 * Note that the `domain` property should be equal to the frontend
 * deployment URL, i.e. if website runs at "elevate.app", then the
 * domain must be the same. You can also use wildcard domain names
 * but we recommend that you do that only for development purposes.
 * <br /><br />
 * @example Using the `CookiePayload` interface
 * ```ts
 * const payload = {
 *   name: "ELEVATE",
 *   domain: "elevate.dhealth.com",
 *   secret: "AuthSecretUsedToSignCookies",
 *   challenge: "fakeChallenge"
 * } as CookiePayload;
 * ```
 *
 * @since v0.3.0
 */
export interface CookiePayload {
  name: string;
  domain: string;
  secret?: string;
  challenge?: string;
}

/**
 * @interface AuthenticationPayload
 * @description This type is used to describe an authentication
 * payload that contains a user's address. After successful log-in
 * we create a *signed* cookie that contains some OAuth-related
 * fields such as `sub`, and already-public information about the
 * logged-in end-user.
 * <br /><br />
 * Authentication payloads currently consist of:
 * - A `sub` field that contains a log-in operation's completion
 *   transaction hash. This permits to *scope* authenticated sessions
 *   and is typically used to describe "one subscription".
 * - A `address` field that contains the authenticated account session's
 *   dHealth Network Address. This is typically used as the "username".
 * - An optional `referralCode` field that contains a referral code
 *   previously attached to the account that invited the authenticating
 *   account to the dApp.
 * <br /><br />
 * @example Using the `AuthenticationPayload` interface
 * ```ts
 * const authorizedUser: AuthenticationPayload = {
 *   sub: transaction.transactionInfo.hash,
 *   address: authorizedAddr.pretty(),
 * };
 * ```
 *
 * @since v0.3.0
 */
export interface AuthenticationPayload {
  sub: string;
  address: string;
  referralCode?: string;
}

/**
 * @label COMMON
 * @class AuthService
 * @description This class serves as an *authentication handler* for users.
 * This can be used to *authenticate* the access to [a subset] of your dApp
 * routes and modules.
 * <br /><br />
 * You can use this service to *generate authentication challenges*, or to
 * *validate the presence of authentication challenges* on-chain, or to get
 * *access tokens* and *refresh tokens* for authenticated users.
 *
 * @since v0.2.0
 */
@Injectable()
export class AuthService {
  /**
   * Contains the generated *cookie payload*. This property is
   * filled using configuration fields in the `config/security.ts`
   * configuration file.
   *
   * @access protected
   * @var {CookiePayload}
   */
  protected cookie: CookiePayload;

  /**
   * Contains the *challenge size* as set in `config.security.ts`.
   * <br /><br />
   * Note that by modifying the default *challenge size*, you may
   * affect the operations processor and thereby the data that is
   * returned by the backend.
   *
   * @access protected
   * @var {number}
   */
  protected challengeSize: number;

  /**
   * Contains the *authentication secret* as set in `config.security.ts`.
   * It defines a symmetric secret key and is used for signing access
   * tokens.
   *
   * @access private
   * @var {string}
   */
  private authSecret: string;

  /**
   * This method extracts a JWT Token from different parts of the
   * request object with following order:
   * - Signed cookies
   * - Unsigned cookies
   * - Authorization header
   *
   * @param   {Request}   request     A `express` Request object.
   * @returns {string|null}
   */
  public static extractToken(
    request: Request,
    cookieName: string = conf.dappName,
  ): string | null {
    // private local helper function to extract
    // a key from an object only if it is defined
    const extract = (from: any, asKey: string): string | undefined => {
      return from !== undefined && asKey in from ? from[asKey] : undefined;
    };

    // extract the access token with following precedence order:
    // - Server Signed Cookies
    // - Request/Browser Cookies
    // - Request Authorization Header
    const fromSignedCookies = extract(request.signedCookies, cookieName);
    const fromRequestCookies = extract(request.cookies, cookieName);
    const fromRequestHeaders = extract(request.headers, "Authorization");

    // are we able to extract a token?
    let token: string =
      fromSignedCookies ?? fromRequestCookies ?? fromRequestHeaders ?? null;

    // remove Bearer prefix if extracting from (unsecure) header
    if (token && token.length && null !== token.match(/^Bearer /)) {
      token = token.replace(/^Bearer /, "");
    }

    return token;
  }

  /**
   * Constructs an instance of the authentication service and sets
   * up the *cookie generation* and *challenge generation* routines.
   *
   * @access public
   * @param   {AuthChallengeModel}         model
   * @param   {ConfigService}              configService
   * @param   {NetworkService}             networkService
   * @param   {AccountsService}            accountsService
   * @param   {AccountSessionsService}     accountSessionsService
   * @param   {ChallengesService}          challengesService
   * @param   {JwtService}                 jwtService
   */
  public constructor(
    private readonly configService: ConfigService,
    private readonly networkService: NetworkService,
    private readonly accountsService: AccountsService,
    private readonly accountSessionsService: AccountSessionsService,
    private readonly challengesService: ChallengesService,
    private jwtService: JwtService,
  ) {
    const name = this.configService.get<string>("dappName");
    const domain = this.configService.get<string>("frontendApp.host");
    const secret = this.configService.get<string>("auth.secret");
    const challenge = this.configService.get<string>("challenge");

    // configures cookie(s) creation
    this.cookie = { name, domain, secret, challenge } as CookiePayload;
    this.challengeSize = this.configService.get<number>("auth.challengeSize");
    this.authSecret = secret;
  }

  /**
   * This method returns the configured *cookie payload*. Note that
   * we do not permit the *secret* to be shared by destructuring it
   * out of the returned payload, i.e. the secret is never returned
   * with this method.
   *
   * @returns {CookiePayload}   A cookie payload without the *secret* field.
   */
  public getCookie(): CookiePayload {
    const { secret, ...cookie } = this.cookie;
    return cookie;
  }

  /**
   * This method generates a random authentication challenge.
   * <br /><br />
   * The size of the generated authentication challenges can be changed
   * in the configuration file `config/security.ts`.
   * <br /><br />
   * Note that by modifying the default *challenge size*, you may
   * affect the operations processor and thereby the data that is
   * returned by the backend.
   *
   * @returns {string}   An authentication challenge that can be attached on-chain.
   */
  public getChallenge(): string {
    // generates random number using greatest radix (36)
    // which serves numbers's representation in ASCII
    const size: number = this.challengeSize;
    return ChallengesService.generateChallenge(size);
  }

  /**
   * This method **extract** an access token from the {@link AuthService}
   * class and use it to query the owner account from the database.
   *
   * @param   {Request}     request      An `express` Request object.
   * @param   {string}      cookieName   The name of the cookie to perform access token extraction from.
   * @returns {Promise<AccountDocument>} The account that has the provided `cookie`.
   */
  public async getAccount(
    request: Request,
    cookieName: string = conf.dappName,
  ): Promise<AccountDocument> {
    // read and decode access token
    const token: string = AuthService.extractToken(request, cookieName);

    // find account session in database
    const accountSession = await this.accountSessionsService.findOne(
      new AccountSessionQuery({
        accessToken: token,
      } as AccountSessionDocument),
    );

    // find profile information in database
    return await this.accountsService.findOne(
      new AccountQuery({
        address: accountSession.address,
      } as AccountDocument),
    );
  }

  /**
   * This method *validates* the presence of an *authentication challenge*
   * on-chain, in transfer transaction messages. When we can't find a recent
   * transaction (confirmed/unconfirmed) that contains the `challenge` value
   * this method will throw a `HttpException` with status code **401**.
   * <br /><br />
   * In case of a *successful* validation attempts, i.e. when the `challenge`
   * parameter **has been found** in a recent transfer transaction's message,
   * a document will be *insert* in the collection `authChallenges`.
   *
   * @param   {AccessTokenRequest}  param0          An authentication challenge, as created with {@link getChallenge}.
   * @param   {boolean}             enableStorage   Flag that defines if challenge should be stored in database for the case when need to check validity of challenge. Defaults to true.
   * @returns {Promise<AuthenticationPayload>}  An authenticated account session described with {@link AuthenticationPayload}.
   * @throws  {HttpException}           Given challenge could not be found in recent transactions.
   */
  public async validateChallenge(
    {
      challenge,
      sub,
      registry,
    }: AccessTokenRequest,
    enableStorage: boolean = true,
  ): Promise<AuthenticationPayload> {
    // does not permit multiple usage of challenges
    const challengeUsed: boolean = await this.challengesService.exists(
      new AuthChallengeQuery({
        challenge: challenge,
      } as AuthChallengeDocument),
    );

    // responds with error if the `challenge` **was used before**
    // 401: Unauthorized
    if (true === challengeUsed) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    // query latest 100 transactions + unconfirmed transactions
    // to find the challenge, possibly, in the "recent" storage
    const transaction: TransferTransaction = await this.findRecentChallenge(
      registry,
      challenge,
    );

    // responds with error if the `challenge` could **not** be found
    // 401: Unauthorized
    if (undefined === transaction) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    // for authentication operations, the transaction **signer**
    // is the account session that is trying to authenticate
    const authorizedAddr: Address = transaction.signer.address;
    const authorizedUser: AuthenticationPayload = {
      sub,
      address: authorizedAddr.plain(),
    };

    // print INFO log for authorized log-in attempts
    const logger = new LogService(AppConfiguration.dappName);
    logger.log(`Authorizing log-in challenge for "${authorizedUser.address}"`);

    if (enableStorage === true) {
      // stores a validated authentication challenge
      // in the database collection `authChallenges`
      await this.challengesService.createOrUpdate(
        new AuthChallengeQuery({
          challenge: challenge,
        } as AuthChallengeDocument),
        {
          usedBy: authorizedAddr.plain(),
          usedAt: new Date().valueOf(),
        },
      );
    }

    // this.authGateWay.server.emit("auth.complete");

    // returns the authorized user details
    return authorizedUser;
  }

  /**
   * This method accepts a {@link AuthenticationPayload} object
   * of which the `address` field is used to find the related
   * `account-sessions` document *by address*.
   * <br /><br />
   * We read the access/refresh token(s) from the `account-sessions`
   * document *if possible*, otherwise we *generate them* and
   * *sign them using the authentication secret* as provided
   * in the configuration file `config/security.ts`.
   * <br /><br />
   * Note that the expiration of access tokens automatically
   * happens after one hour of lifetime.
   *
   * @param   {AuthenticationPayload}   payload   The authentication payload of validated log-in operation.
   * @returns {Promise<AccessTokenDTO>}   An access token for the authenticated user and possibly a refresh token (first time).
   */
  public async getAccessToken(
    payload: AuthenticationPayload,
  ): Promise<AccessTokenDTO> {
    let accessToken: string, refreshToken: string;

    // finds the related `account-sessions` document (if any)
    const accountSession: AccountSessionDocument =
      await this.accountSessionsService.findOne(
        this.getAccountSessionQuery(payload),
      );

    // tries to read tokens from `account-sessions` document
    if (null !== accountSession) {
      accessToken = accountSession.accessToken ?? null;
      refreshToken = accountSession.refreshTokenHash ?? null;
    }

    // block: creating access token
    try {
      // if we don't have an active access token for this user
      // constructs a short-lived accessToken for the next hour
      if (undefined === accessToken || null === accessToken) {
        accessToken = this.jwtService.sign(payload, {
          // defines a symmetric secret key for signing tokens
          secret: this.authSecret,
          expiresIn: "1h", // 1 hour expiry for access tokens
        });
      }
      // if on the other hand, we already have an active access
      // token for the account session, we verify that it hasn't expired
      else {
        this.jwtService.verify(accessToken, {
          secret: this.authSecret,
          ignoreExpiration: false,
          maxAge: "1h",
        });
      }

      // token is valid [or new] and not expired
    } catch (e: any) {
      // token expired, we must to create a new one
      if ("name" in e && e.name === "TokenExpiredError") {
        accessToken = this.jwtService.sign(payload, {
          // defines a symmetric secret key for signing tokens
          secret: this.authSecret,
          expiresIn: "1h", // 1 hour expiry for access tokens
        });
      }
      // token is invalid / signature is invalid
      else {
        throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      }
    }
    // /block: creating access token

    // prepare an update of the user's accessToken
    const userData: any = {
      accessToken,
      lastSessionHash: payload.sub, // contains a transaction hash
    };

    // prepare a result object (DTO) that holds only an
    // access token OR a pair of access- and refresh- tokens
    const accessTokenDTO: AccessTokenDTO = { accessToken };

    // block: creating refresh token
    // if we don't have an active refresh token for this user
    // constructs a long-lived refreshToken for the next year
    // and store a copy of the created tokens in `account-sessions`
    if (undefined === refreshToken || null === refreshToken) {
      refreshToken = this.jwtService.sign(payload, {
        // defines a symmetric secret key for signing tokens
        secret: this.authSecret,
        expiresIn: "1y", // 1 year expiry for refresh tokens
      });

      // as we just created a refreshToken, we store a hash of it
      userData.refreshTokenHash = sha3_256(refreshToken);
      accessTokenDTO.refreshToken = refreshToken;
    }
    // /block: creating refresh token

    // block: updating referral data
    // automatically generate a new referral code given
    // unknown `accounts` (by address).
    if (!accountSession || !accountSession.referralCode) {
      userData.referralCode = `JOINFIT-${Math.random().toString(36).slice(-8)}`;
    }

    // given a referral code in the authentication payload
    // we *may* need to update the accounts document
    if (payload.referralCode) {
      const referrer = await this.accountsService.findOne(
        new AccountQuery({
          referralCode: payload.referralCode,
        } as AccountDocument),
      );

      // given empty "referredBy" for account and valid
      // referrer account, we keep track of this referral
      if (
        undefined !== referrer &&
        undefined !== referrer.address &&
        payload.address !== referrer.address &&
        (accountSession === undefined ||
          accountSession.referredBy === undefined)
      ) {
        userData.referredBy = referrer.address;
      }
    }
    // /block: updating referral data

    // store tokens in `account-sessions` document
    // note that we store a *hash* of the refresh token
    // otherwise there would be too much risk in leaking
    await this.accountSessionsService.createOrUpdate(
      this.getAccountSessionQuery(payload),
      userData,
    );

    // return pair of tokens (this is the "first" time)
    // specifying refreshToken explicitly sets undefined
    // given no refreshToken was generated
    return accessTokenDTO as AccessTokenDTO;
  }

  /**
   * This method accepts an end-user address (string) and a
   * *refresh token* which must be valid as a pair.
   * <br /><br />
   * This method will *generate a new access token*,
   * *sign it using the authentication secret* as provided
   * in the configuration file `config/security.ts` and
   * returns it in a {@link AccessTokenDTO} object.
   * <br /><br />
   * Note that the expiration of access tokens automatically
   * happens after one hour of lifetime.
   *
   * @access public
   * @async
   * @param   {string}  userAddress       The address of the end-user for which a new access token must be generated ("Refresh").
   * @returns {Promise<AccessTokenDTO>}   An access token for the authenticated user.
   * @throws  {HttpException}             Given invalid log-in state for the requested account session.
   */
  public async refreshAccessToken(
    userAddress: string,
    refreshToken: string,
  ): Promise<AccessTokenDTO> {
    // find existing refresh token to user and refresh
    // the attached *access token* if necessary
    const accountSession: AccountSessionDocument =
      await this.accountSessionsService.findOne(
        new AccountSessionQuery({
          address: userAddress,
          refreshTokenHash: sha3_256(refreshToken),
        } as AccountSessionDocument),
      );

    // responds with error if the account session was not
    // previously logged-in, the refresh call is invalid
    // 401: Unauthorized
    if (
      undefined === accountSession ||
      undefined === accountSession.lastSessionHash
    ) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    // creates an authentication payload and
    // extends its lifetime for one more hour
    const payload: AuthenticationPayload = {
      sub: accountSession.lastSessionHash,
      address: accountSession.address,
    };

    // always re-generates a new access token provided
    // a valid address and refresh token pair are passed
    const accessToken: string = this.jwtService.sign(payload, {
      // defines a symmetric secret key for signing tokens
      secret: this.authSecret,
      expiresIn: "1h", // 1 hour expiry for access tokens
    });

    // store new accessToken in `account-sessions` document
    await this.accountSessionsService.createOrUpdate(
      this.getAccountSessionQuery(payload),
      {
        accessToken,
      },
    );

    // return only access token, this is a follow-up call
    // as we *already* have an active refresh token created
    return { accessToken } as AccessTokenDTO;
  }

  /**
   * This method returns an *account sessions query* for the mongo collection
   * named `account-sessions`, and is used to query an account by the address
   * attached inside the {@link AuthenticationPayload} payload.
   *
   * @access protected
   * @param   {AuthenticationPayload}   payload
   * @returns {AccountSessionQuery}
   */
  protected getAccountSessionQuery(
    payload: AuthenticationPayload,
  ): AccountSessionQuery {
    return new AccountSessionQuery({
      address: payload.address,
      sub: payload.sub,
    } as AccountSessionDocument);
  }

  /**
   * This method returns a **transactions query** that is compatible
   * with dHealth Network Node's REST gateway.
   * <br /><br />
   * To change the registry, you can modify the `auth.registries`
   * configuration field in `config/security.ts`. Please, note that
   * changing this configuration field may affect *ongoing log-in*
   * operations of end-users.
   *
   * @link https://docs.dhealth.com/reference/searchconfirmedtransactions
   * @access protected
   * @returns   {TransactionSearchCriteria}   A list of REST-gateway compatible transaction *search* queries.
   */
  protected getTransactionQuery(registry: string): TransactionSearchCriteria {
    // get the account address from config
    const registries = this.configService.get<string[]>("auth.registries");

    // returns null if the provided registry is not found in the configured list
    if (!registries.includes(registry)) {
      return null;
    }

    // get the parsed dHealth account address from the registry
    const authRegistryAddress: Address =
      AccountsService.createAddress(registry);

    // returns a REST-compatible query
    return {
      recipientAddress: authRegistryAddress,
      type: [TransactionType.TRANSFER],
      embedded: false,
      order: Order.Desc,
      pageNumber: 1,
      pageSize: 100,
    } as TransactionSearchCriteria;
  }

  /**
   * This method fetches *recent transactions* using the network
   * service (promises are delegated), and interprets the content
   * of messages in transfer transactions.
   * <br /><br />
   * A `TransferTransaction` instance *will only be returned* given
   * that the `challenge` *can be found in a transaction*, otherwise
   * it returns `undefined`.
   *
   * @async
   * @access protected
   * @param   {string}    registry      The authentication registry address to search for in recent transactions.
   * @param   {string}    challenge     The authentication challenge to search for in recent transactions.
   * @returns {Promise<TransferTransaction | undefined>}  A transfer transaction instance given a validated authentication challenge, or undefined.
   */
  protected async findRecentChallenge(
    registry: string,
    challenge: string,
  ): Promise<TransferTransaction | undefined> {
    // if registry is null/undefined, return
    if (!registry) return;

    // prepares the transaction query
    const recentQuery = this.getTransactionQuery(registry);

    // if transaction query is null/undefined
    if (!recentQuery) return;

    // prepares the promises to run a *transactions search*
    // for groups Confirmed and Unconfirmed
    const repository = this.networkService.transactionRepository;
    const promises: Promise<Page<Transaction>>[] = [
      repository
        .search({ ...recentQuery, group: TransactionGroup.Unconfirmed })
        .toPromise(),
      repository
        .search({ ...recentQuery, group: TransactionGroup.Confirmed })
        .toPromise(),
    ];

    // executes the promises and fetches sync-state
    // uses the network service to execute transaction queries
    // as to avoid request failures due to node connection issues
    const transactionPages = await this.networkService.delegatePromises(
      promises,
    );

    // reduces the returned transaction pages to one
    // flat array of **transfer** transactions
    const transactions: TransferTransaction[] = transactionPages.reduce(
      (prev, cur) =>
        prev.concat(cur.data.map((t: Transaction) => t as TransferTransaction)),
      [],
    );

    // we want to return the only transaction that
    // contains exactly the necessary challenge
    return transactions.find((t: TransferTransaction) => {
      try {
        // do we have a valid contract JSON payload?
        const spec: Contract = Factory.createFromTransaction(t);

        // do we have the *relevant* challenge?
        const dAppName = this.cookie.name.toLowerCase();
        if (spec.signature === `${dAppName}:auth`) {
          const contract: Auth = spec as Auth;
          return (
            "challenge" in contract.inputs &&
            contract.inputs.challenge === challenge
          );
        }

        return false;
      } catch (e) {
        return false;
      }
    });
  }
}
