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
import { HttpException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { sha3_256 } from "js-sha3";
import { Crypto } from "@dhealth/sdk";

// internal dependencies
import { QueryService } from "./QueryService";
import { PaginatedResultDTO } from "../models/PaginatedResultDTO";
import { OAuthProviderParameters } from "../models/OAuthConfig";
import { AccountDocument } from "../models/AccountSchema";
import {
  AccountIntegration,
  AccountIntegrationDocument,
  AccountIntegrationModel,
  AccountIntegrationQuery,
} from "../models/AccountIntegrationSchema";
import { OAuthCallbackRequest } from "../requests/OAuthCallbackRequest";

// OAuth Drivers Implementation
import { OAuthDriver } from "../drivers/OAuthDriver";
import { BasicOAuthDriver } from "../drivers/BasicOAuthDriver";
import { StravaOAuthDriver } from "../drivers/StravaOAuthDriver";

/**
 * @class OAuthService
 * @description This class contains methods
 * for connecting, linking accounts to the providers
 * usage example can be found in OAuthController
 *
 * @since v0.2.0
 */
@Injectable()
export class OAuthService {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {ConfigService} configService
   */
  public constructor(
    @InjectModel(AccountIntegration.name)
    private readonly model: AccountIntegrationModel,
    private readonly configService: ConfigService,
    private readonly queryService: QueryService<
      AccountIntegrationDocument,
      AccountIntegrationModel
    >,
  ) {}

  /**
   * This method determines and creates an OAuth driver
   * from the inputs' provider name and config and returns
   * a {@link OAuthDriver} object.
   *
   * @access private
   * @param   {string}  providerName  Contains the identifier of the OAuth Provider, e.g. "strava".
   * @param   {OAuthProviderParameters}  providerConfig The OAuth provider parameters, i.e. URLs and configuration.
   * @returns {OAuthDriver} The created driver instance.
   */
  private driverFactory(
    providerName: string,
    providerConfig: OAuthProviderParameters,
  ): OAuthDriver {
    // determine which **driver** must be used
    if ("strava" === providerName) {
      return new StravaOAuthDriver(providerConfig);
    }

    // for any unlisted provider, use basic OAuth
    return new BasicOAuthDriver(providerName, providerConfig);
  }

  /**
   * This method reads an OAuth provider configuration
   * from the runtime configuration file `config/oauth.ts`
   * and returns a {@link OAuthProviderParameters} object.
   *
   * @access public
   * @param   {string}    providerName   Contains the identifier of the OAuth Provider, e.g. "strava".
   * @returns {OAuthProviderParameters}  The OAuth provider parameters, i.e. URLs and configuration.
   */
  public getProvider(providerName: string): OAuthProviderParameters {
    // reads OAuth provider from configuration
    const provider = this.configService.get<OAuthProviderParameters>(
      `providers.${providerName}`,
    );

    // throw an error if the provider is unknown
    if (undefined === provider) {
      throw new Error(`Invalid oauth provider "${providerName}".`);
    }

    // :OAuthProviderParameters
    return provider;
  }

  /**
   * Generate an encryption password (seed) to protect the access
   * token using a combination of the authentication secret, the
   * user address and Strava-owned authentication details.
   *
   * @access private
   * @param   {AccountIntegrationDocument}  integration   The *document* of OAuth *integration*.
   * @returns {string}  The generated encryption seed.
   */
  private getEncryptionSeed(integration: AccountIntegrationDocument): string {
    // protect the access token using a combination of
    // the authentication secret, the user address and
    // Strava-owned authentication details.
    const authSecret: string = this.configService.get<string>("auth.secret");
    const encPassword: string =
      authSecret +
      sha3_256(
        `${authSecret}` +
          `${integration.address}` +
          `${integration.remoteIdentifier}` +
          `${integration.authorizationHash}`,
      );

    return encPassword;
  }

  /**
   * Method to returns the remote *authorization URL* to link
   * accounts e.g. "Strava OAuth URL".
   *
   * @access public
   * @param   {string}  providerName    Contains the identifier of the OAuth Provider, e.g. "strava".
   * @param   {string}  dhealthAddress  The Address of the user account on dHealth Network.
   * @param   {string}  referralCode    The provided referral code.
   * @returns {string}  The remote *authorization URL* to link accounts.
   */
  public getAuthorizeURL(
    providerName: string,
    dhealthAddress: string,
    referralCode?: string,
  ): string {
    // reads OAuth provider from configuration
    const provider = this.getProvider(providerName);

    // creates the OAuth implementation driver
    const driver = this.driverFactory(providerName, provider);

    // generates the "extras" part that attaches the dHealth
    // address and possibly a referral code to forward.
    const extra: string =
      `${dhealthAddress}` +
      // in case a referral code is present, split with `:`
      (!!referralCode ? `:${referralCode}` : "");

    // creates a `OAuthDriver` depending on the provider name
    // and returns the remote *authorization URL* to link accounts
    return driver.getAuthorizeURL(extra);
  }

  /**
   * This method sends an OAuth callback request to the provider and
   * stores the integration result's details in database.
   * <br /><br />
   * Note that this process includes requesting an access/refresh token
   * from the provider and creating an *encryption password* that will be
   * used to sign the access/refresh tokens pair.
   *
   * @access public
   * @async
   * @param   {string}  providerName  Contains the identifier of the OAuth Provider, e.g. "strava".
   * @param   {AccountDocument}  account  The account document to be integrated with access/refresh tokens.
   * @param   {OAuthCallbackRequest}  request The OAuth callback request.
   * @returns {Promise<AccountIntegrationDocument>} The result account integration document that has been saved.
   */
  public async oauthCallback(
    providerName: string,
    account: AccountDocument,
    request: OAuthCallbackRequest,
  ): Promise<AccountIntegrationDocument> {
    // first make sure we actually have an authorization
    const integration = await this.getIntegration(
      providerName,
      request.identifier,
    );
    if (!integration || !("address" in integration)) {
      throw new HttpException(`Forbidden`, 403);
    }

    // reads OAuth provider from configuration
    const provider = this.getProvider(providerName);

    // creates the OAuth implementation driver
    const driver = this.driverFactory(providerName, provider);

    // requests an access token using the provider's
    // token URL in a `POST` request, then returns a
    // wrapped `AccessTokenDTO`
    const tokenDTO = await driver.getAccessToken(request.code, request.state);

    // protect the access token using a combination of
    // the authentication secret, the user address and
    // Strava-owned authentication details.
    const encPassword: string = this.getEncryptionSeed(integration);

    // encrypt the access/refresh tokens pair
    const { accessToken, refreshToken } = tokenDTO;
    const encAccessToken: string = Crypto.encrypt(accessToken, encPassword);
    const encRefreshToken: string = Crypto.encrypt(refreshToken, encPassword);

    // store tokens *encrypted* in `account_integrations` document
    return await this.updateIntegration(providerName, account, {
      encAccessToken,
      encRefreshToken,
    });
  }

  /**
   * Method to update the {@link AccountIntegrationDocument} in database.
   *
   * @access public
   * @async
   * @param   {string}    providerName    Contains the identifier of the OAuth Provider, e.g. "strava".
   * @param   {AccountDocument}    account    The account document to be integrated with access/refresh tokens.
   * @param   {Record<string, any>}    data   The update data content to be applied.
   * @returns {Promise<AccountIntegrationDocument>}   The updated account integration document.
   */
  public async updateIntegration(
    providerName: string,
    account: AccountDocument,
    data: Record<string, any>,
  ): Promise<AccountIntegrationDocument> {
    // this block hashes a possible "authorizeUrl"
    // or uses the data directly to update documents
    let updateData: Record<string, any> = data;
    if ("authorizeUrl" in data) {
      updateData = {
        authorizationHash: sha3_256(data.authorizeUrl),
      };
    }

    // create an `account_integrations` document for this user
    const integration = await this.queryService.createOrUpdate(
      new AccountIntegrationQuery({
        address: account.address,
        name: providerName,
      } as AccountIntegrationDocument),
      this.model,
      updateData,
      {},
    );

    return integration;
  }

  /**
   * Method to find {@link AccountIntegrationDocument} from the
   * database by querying with fields of an {@link AccountDocument}.
   *
   * @access public
   * @async
   * @param   {AccountDocument}  account  The account document to query the corresponding integration document from the database.
   * @returns {Promise<PaginatedResultDTO<AccountIntegrationDocument>>} The paginated result of the account integration documents.
   */
  public async getIntegrations(
    account: AccountDocument,
  ): Promise<PaginatedResultDTO<AccountIntegrationDocument>> {
    return await this.queryService.find(
      new AccountIntegrationQuery({
        address: account.address,
      } as AccountIntegrationDocument),
      this.model,
    );
  }

  /**
   * Method to find one {@link AccountIntegrationDocument} from the
   * database by querying with *provider name* and *remote identifier*.
   *
   * @access public
   * @async
   * @param   {string}  provider  Contains the identifier of the OAuth Provider, e.g. "strava".
   * @param   {string}  remoteIdentifier  The remote identifier to query account integration document from.
   * @returns {Promise<AccountIntegrationDocument>} The result account integration document.
   */
  public async getIntegration(
    provider: string,
    remoteIdentifier: string,
  ): Promise<AccountIntegrationDocument> {
    return await this.queryService.findOne(
      new AccountIntegrationQuery({
        name: provider,
        remoteIdentifier: remoteIdentifier,
      } as AccountIntegrationDocument),
      this.model,
    );
  }
}
