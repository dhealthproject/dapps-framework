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
import moment from "moment";

// internal dependencies
import { QueryService } from "../../common/services/QueryService";
import { CipherService } from "../../common/services/CipherService";
import { OAuthProviderParameters } from "../models/OAuthConfig";
import { AccountDocument } from "../../common/models/AccountSchema";
import {
  AccountIntegration,
  AccountIntegrationDocument,
  AccountIntegrationModel,
  AccountIntegrationQuery,
} from "../../common/models/AccountIntegrationSchema";
import { PaginatedResultDTO } from "../../common/models/PaginatedResultDTO";
import { ResponseStatusDTO } from "../../common/models/ResponseStatusDTO";
import { OAuthCallbackRequest } from "../requests/OAuthCallbackRequest";
import { HttpMethod } from "../../common/drivers/HttpRequestHandler";

// OAuth Drivers Implementation
import { OAuthDriver } from "../drivers/OAuthDriver";
import { OAuthEntity, OAuthEntityType } from "../drivers/OAuthEntity";
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
    private readonly cipher: CipherService,
  ) {}
  /**
   * This property represents valid scope
   * received from provider.
   *
   */
  expectedScope = "read,activity:read_all";

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
   * Generate an encryption password (seed) to protect the access
   * token using a combination of the authentication secret, the
   * user address and Strava-owned authentication details.
   *
   * @access private
   * @param   {AccountIntegrationDocument}  integration   The *document* of OAuth *integration*.
   * @param   {string}  remoteIdentifier   The *remote identifier* of the end-user (remote as in "from Strava").
   * @returns {string}  The generated encryption seed.
   */
  private getEncryptionSeed(
    integration: AccountIntegrationDocument,
    remoteIdentifier: string,
  ): string {
    // protect the access token using a combination of
    // the authentication secret, the user address and
    // Strava-owned authentication details.
    const authSecret: string = this.configService.get<string>("auth.secret");
    const encPassword: string =
      authSecret +
      sha3_256(
        `${authSecret}` +
          `${integration.address}` +
          `${remoteIdentifier}` +
          `${integration.authorizationHash}`,
      );

    return encPassword;
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
   * @throws  {HttpException}   HTTP 403 - Forbidden: Given missing oauth authorization from {@link getIntegration}.
   */
  public async oauthCallback(
    providerName: string,
    account: AccountDocument,
    request: OAuthCallbackRequest,
  ): Promise<AccountIntegrationDocument> {
    // first make sure we actually have an authorization
    const integration = await this.getIntegration(
      providerName,
      account.address,
    );
    if (!integration || !("address" in integration)) {
      throw new HttpException(`Forbidden`, 403);
    }
    // if scope not contains read_all - throw an exception
    if (request && request.scope !== this.expectedScope) {
      throw new HttpException(`Unauthorized`, 401);
    }

    // reads OAuth provider from configuration
    const provider = this.getProvider(providerName);

    // creates the OAuth implementation driver
    const driver = this.driverFactory(providerName, provider);

    // requests an access token using the provider's
    // token URL in a `POST` request, then returns a
    // wrapped `AccessTokenDTO`
    const tokenDTO = await driver.getAccessToken(request.code, request.state);
    const { remoteIdentifier, accessToken, refreshToken, expiresAt } = tokenDTO;

    // protect the access token using a combination of
    // the authentication secret, the user address and
    // Strava-owned authentication details.
    const encPassword: string = this.getEncryptionSeed(
      integration,
      remoteIdentifier,
    );

    // encrypt the access/refresh tokens pair
    const encAccessToken: string = this.cipher.encrypt(
      accessToken,
      encPassword,
    );
    const encRefreshToken: string = this.cipher.encrypt(
      refreshToken,
      encPassword,
    );

    // store tokens *encrypted* in `account_integrations` document
    return await this.updateIntegration(providerName, account.address, {
      remoteIdentifier,
      encAccessToken,
      encRefreshToken,
      expiresAt,
    });
  }

  /**
   * This method sends an OAuth access token *refresh* request to the provider
   * and stores the integration result's details in database.
   * <br /><br />
   * Note that this process includes requesting an access/refresh token
   * from the provider and creating an *encryption password* that will be
   * used to sign the access/refresh tokens pair.
   *
   * @access public
   * @async
   * @param   {string}  providerName  Contains the identifier of the OAuth Provider, e.g. "strava".
   * @param   {AccountIntegrationDocument}  integration  The `accountintegrations` entity that will be updated.
   * @returns {Promise<AccountIntegrationDocument>} The resulting account integration document that has been saved.
   * @throws  {HttpException}   HTTP 403 - Forbidden: Given missing oauth authorization from `integration` parameter.
   */
  public async refreshAccessToken(
    providerName: string,
    integration: AccountIntegrationDocument,
  ): Promise<AccountIntegrationDocument> {
    if (!integration || !("address" in integration)) {
      throw new HttpException(`Forbidden`, 403);
    }

    // decrypts the refresh token
    const encPassword: string = this.getEncryptionSeed(
      integration,
      integration.remoteIdentifier,
    );
    const decRefreshToken: string = this.cipher.decrypt(
      integration.encRefreshToken,
      encPassword,
    );

    // reads OAuth provider from configuration
    const provider = this.getProvider(providerName);

    // creates the OAuth implementation driver
    const driver = this.driverFactory(providerName, provider);

    // requests an access token using the provider's
    // token URL in a `POST` request, then returns a
    // wrapped `AccessTokenDTO`
    const tokenDTO = await driver.updateAccessToken(decRefreshToken);

    // encrypt the newly received access/refresh tokens pair
    const { accessToken, refreshToken, expiresAt } = tokenDTO;
    const encAccessToken: string = this.cipher.encrypt(
      accessToken,
      encPassword,
    );
    const encRefreshToken: string = this.cipher.encrypt(
      refreshToken,
      encPassword,
    );

    // store tokens *encrypted* in `account_integrations` document
    return await this.updateIntegration(providerName, integration.address, {
      encAccessToken,
      encRefreshToken,
      expiresAt,
    });
  }

  /**
   * This method executes a basic HTTP handler that uses `axios` under the
   * hood, to execute a HTTP request to a remote data provider API. This
   * method can be used to request *specific* endpoints from the providers
   * API, e.g. `/activities/:id` from Strava.
   * <br /><br />
   * Note that the *access token* attached to the request as an `Authorization`
   * header (Bearer), is the one from the `integration` parameter. This permits
   * to execute requests using the account's valid OAuth authorization.
   * <br /><br />
   * Note that you *do not* need to add an access token header in the options
   * parameters, it will be added automatically whenever you use this method.
   *
   * @access public
   * @async
   * @param   {AccountIntegrationDocument}  integration  The `accountintegrations` entity that will be updated.
   * @param   {string}  endpointUri  The endpoint URI that must be requested from the remote data provider API.
   * @returns {Promise<ResponseStatusDTO>} A response object that contains a `status`, `code` and `response` as defined in {@link ResponseStatusDTO}.
   * @throws  {HttpException}   HTTP 403 - Forbidden: Given missing oauth authorization from {@link getIntegration}.
   */
  public async callProviderAPI(
    endpointUri: string,
    integration: AccountIntegrationDocument,
    httpOptions: {
      method: HttpMethod;
      body?: any;
      options?: any;
      headers?: any;
    } = {
      method: "GET",
      body: undefined,
      options: undefined,
      headers: undefined,
    },
  ): Promise<ResponseStatusDTO> {
    if (!integration || !("address" in integration)) {
      throw new HttpException(`Forbidden`, 403);
    }

    // if the access token is expired, or will expire
    // now, then we first have to *refresh* from provider
    const serverTime = moment(new Date().valueOf());
    const expireTime = moment(integration.expiresAt);
    if (expireTime.isBefore(serverTime) || expireTime.isSame(serverTime)) {
      // fetches a new access token using refresh token
      integration = await this.refreshAccessToken(
        integration.name,
        integration,
      );
    }

    // reads OAuth configuration for provider and creates
    // an instance of the OAuth driver implementation
    // - reads OAuth provider from configuration
    // - creates the OAuth driver implementation
    const provider = this.getProvider(integration.name);
    const driver = this.driverFactory(integration.name, provider);

    // the forwarded request requires the accessToken field
    // to be in *plaintext* format, we decrypt it here for use
    const encPassword: string = this.getEncryptionSeed(
      integration,
      integration.remoteIdentifier,
    );
    const decAccessToken: string = this.cipher.decrypt(
      integration.encAccessToken,
      encPassword,
    );

    // executes the data provider API request
    return await driver.executeRequest(
      decAccessToken,
      endpointUri,
      httpOptions.method,
      httpOptions.body ?? undefined,
      httpOptions.options ?? undefined,
      httpOptions.headers ?? undefined,
    );
  }

  /**
   * Method to extract and transform an *entity* as described by the data
   * provider API. Typically, this method is used to handle transformations
   * of remote objects (from data provider API) to internal objects in
   * the backend runtime's database.
   * <br /><br />
   * e.g. This method is used to transform *activity data* as defined
   * by the Strava API, into {@link ActivityData} as defined internally.
   *
   * @access public
   * @param   {string}            providerName  Contains the identifier of the OAuth Provider, e.g. "strava".
   * @param   {any}               data          The API Response object that will be transformed.
   * @param   {OAuthEntityType}   type          (Optional) The type of entity as described in {@link OAuthEntityType}.
   * @returns {OAuthEntity}       A parsed entity object.
   */
  public extractProviderEntity(
    providerName: string,
    data: any,
    type?: OAuthEntityType,
  ): OAuthEntity {
    // reads OAuth provider from configuration
    const provider = this.getProvider(providerName);

    // creates the OAuth implementation driver
    const driver = this.driverFactory(providerName, provider);

    // uses the driver to wrap the entity
    return driver.getEntityDefinition(data, type);
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
    address: string,
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
        address: address,
        name: providerName,
      } as AccountIntegrationDocument),
      this.model,
      updateData,
      {},
    );

    return integration;
  }

  public async deleteIntegration(providerName: string, address: string) {
    try {
      await this.queryService.deleteOne(
        new AccountIntegrationQuery({
          address,
          name: providerName,
        } as AccountIntegrationDocument),
        this.model,
      );
    } catch (e) {
      throw e;
    }
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
   * @param   {string}  address   The address to query account integration document from.
   * @returns {Promise<AccountIntegrationDocument>} The result account integration document.
   */
  public async getIntegration(
    provider: string,
    address: string,
  ): Promise<AccountIntegrationDocument> {
    return await this.queryService.findOne(
      new AccountIntegrationQuery({
        name: provider,
        address: address,
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
   * @param   {string}  remoteIdentifier   The remoteIdentifier to query account integration document from.
   * @returns {Promise<AccountIntegrationDocument>} The result account integration document.
   */
  public async getIntegrationByRemoteIdentifier(
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
