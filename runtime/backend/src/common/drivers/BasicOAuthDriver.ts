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
import { OAuthDriver } from "./OAuthDriver";
import { AccessTokenDTO } from "../models/AccessTokenDTO";
import { OAuthProviderParameters } from "../models/OAuthConfig";
import { ResponseStatusDTO } from "../models/ResponseStatusDTO";
import { HttpMethod, HttpRequestHandler } from "./HttpRequestHandler";

/**
 * @class BasicOAuthDriver
 * @description The dApp basic OAuth driver. This class is used
 * to determine communication, transport and process that are
 * used to connect and integrate to custom providers.
 *
 * @since v0.3.0
 */
export class BasicOAuthDriver implements OAuthDriver {
  /**
   * The driver's **dataFieldName**. This field indicates the name
   * of the data field in this driver. Its value should always be 'state'.
   *
   * @access protected
   * @var {string}
   */
  protected dataFieldName = "state";

  /**
   * The driver's **codeFieldName**. This field indicates the name
   * of the code field in this driver. Its value should always be 'code'.
   *
   * @access protected
   * @var {string}
   */
  protected codeFieldName = "code";

  /**
   * The driver's HTTP service. It's a handler for HTTP requests and contains
   * methods for executing *remote* API calls, e.g. calling a `GET` HTTP API
   * endpoint.
   *
   * @access protected
   * @var {HttpRequestHandler}
   */
  protected httpService: HttpRequestHandler;

  /**
   * Constructs an instance of this driver.
   *
   * @constructor
   * @param {string} name This driver's provider name.
   * @param {OAuthProviderParameters} provider  The config parameters of this driver's provider.
   */
  public constructor(
    protected readonly name: string,
    protected readonly provider: OAuthProviderParameters,
  ) {
    this.httpService = new HttpRequestHandler();
  }

  /**
   * Getter of this driver's provider name.
   *
   * @access public
   * @returns {string}  This driver's provider name.
   */
  public get providerName(): string {
    return this.name;
  }

  /**
   * Getter of this driver's data field name.
   *
   * @access public
   * @returns {string}  This driver's data field name.
   */
  public get dataField(): string {
    return this.dataFieldName;
  }

  /**
   * Getter of this driver's code field name.
   *
   * @access public
   * @returns {string}  This driver's code field name.
   */
  public get codeField(): string {
    return this.codeFieldName;
  }

  /**
   * Method to return the authorize url of this driver's provider.
   *
   * @access public
   * @param   {string}  extra   The `data` value to include in this query.
   * @returns {string}          The full authorize url to send request to.
   */
  public getAuthorizeURL(extra: string): string {
    // prepare the OAuth "authorization" URL
    return (
      `${this.provider.oauth_url}` +
      // pass any extra(s) in "state" by default
      `${this.buildAuthorizeQuery(extra)}` +
      // *always* pass a "scope" (OAuth Scope)
      `&scope=${this.provider.scope}`
    );
  }

  /**
   * Method to return the authorize query to this driver's provider.
   * This is the query parameters that will be included after the
   * authorized url.
   * <br /><br />
   * Note that it contain 3 fields `client_id`, `redirect_uri` and
   * `state` (this driver's `dataField`).
   *
   * @access protected
   * @param   {string}  data  The `data` value to include in this query.
   * @returns {string}        The full query parameters.
   */
  protected buildAuthorizeQuery(data: string): string {
    return (
      `?client_id=${this.provider.client_id}` +
      `&redirect_uri=${encodeURIComponent(this.provider.callback_url)}` +
      `&${this.dataField}=${data}`
    );
  }

  /**
   * Method to return the remote access token. The result is an access/refresh
   * token pair. This method requires the use of an *authorization code* that
   * is provided by the provider.
   * <br /><br />
   * These access tokens are always signed with the dApp's auth secret and expire
   * after 1 hour (one hour).
   *
   * @access public
   * @async
   * @param   {string}      code        The required `code` field value.
   * @param   {string}      data        The required `data` field value.
   * @returns {Promise<AccessTokenDTO>} A promise containing the result {@link AccessTokenDTO}.
   */
  public async getAccessToken(
    code: string,
    data?: string,
  ): Promise<AccessTokenDTO> {
    // prepare the remote access token request
    const params = {
      client_id: this.provider.client_id,
      client_secret: this.provider.client_secret,
      grant_type: "authorization_code",
      [this.codeField]: code,
    };

    // if we have a data field, attach it too
    if (undefined !== data && data.length) {
      params[this.dataField] = data;
    }

    // executes the remote access token request
    return this.requestAccessToken(params);
  }

  /**
   * Method to return an updated access token from the driver's provider
   * using a refresh token. The result is an access/refresh token pair.
   * <br /><br />
   * These access tokens are always signed with the dApp's auth secret and expire
   * after 1 hour (one hour).
   *
   * @access public
   * @async
   * @param   {string}      refreshToken        The user's refresh token.
   * @returns {Promise<AccessTokenDTO>} A promise containing the result {@link AccessTokenDTO}.
   */
  public async updateAccessToken(
    refreshToken?: string,
  ): Promise<AccessTokenDTO> {
    // prepare the remote access token request
    const params = {
      client_id: this.provider.client_id,
      client_secret: this.provider.client_secret,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    };

    // executes the remote access token request
    return this.requestAccessToken(params);
  }

  /**
   * Method to execute a request calling the driver's provider API.
   *
   * @access public
   * @async
   * @param   {string}      accessToken    The *access token* attached as a Bearer token to the request.
   * @param   {string}      endpointUri    The *endpoint URI* of the driver's provider API.
   * @param   {HttpMethod}  method         (Optional) The HTTP method used for the request, e.g. "GET". Defaults to "GET".
   * @param   {any}         body           (Optional) The *body* of the request, as used with "POST" or "PUT" requests. Defaults to an empty object.
   * @param   {any}         options        (Optional) An options object that is directly passed to axios before request execution. Defaults to an empty object.
   * @param   {any}         hedaers        (Optional) Any additional header that is necessary to execute the request. Note that the access token is automatically added. Defaults to an empty object.
   * @returns {Promise<ResponseStatusDTO>} A promise containing the response and status in {@link ResponseStatusDTO}.
   */
  public async executeRequest(
    accessToken: string,
    endpointUri: string,
    method: HttpMethod = "GET",
    body: any = {},
    options: any = {},
    headers: any = {},
  ): Promise<ResponseStatusDTO> {
    // remove starting and trailing slashes
    const requestUrl = endpointUri.replace(/^\//, "");
    const backendUrl = this.provider.api_url.replace(/\/$/, "");

    // build complete fully qualified URL
    const fullRequestURL = `${backendUrl}/${requestUrl}`;

    // request directly from the API
    try {
      const response = await this.httpService.call(
        fullRequestURL,
        method,
        body,
        options,
        {
          ...headers,
          Authorization: `Bearer ${accessToken}`,
        },
      );

      return ResponseStatusDTO.create(200, response);
    } catch (e: any) {
      return ResponseStatusDTO.create(401, {
        message: e.toString(),
        stack: e.stack,
      });
    }
  }

  /**
   * Helper method that executes the actual access token request using a set
   * of `params` parameters. The parameters set *must* contain the following
   * fields:
   * - `client_id`: Your Strava App's client identifier.
   * - `client_secret`: Your Strava App's client secret.
   * - `grant_type`: One of `authorization_code` or `refresh_token`.
   * <br /><br />
   * When executing a *authorization* request for the access token, the field
   * `authorization_code` and `code` are obligatory as well.
   * When executing a *refresh* request for the access token, it is the field
   * `refresh_token` that is obligatory (no code).
   *
   * @access protected
   * @async
   * @param   {Record<string, string>}      params        The parameters for the access token request.
   * @returns {Promise<AccessTokenDTO>} A promise containing the result {@link AccessTokenDTO}.
   */
  protected async requestAccessToken(
    params: Record<string, string>,
  ): Promise<AccessTokenDTO> {
    // request an access token from provider
    const response = await this.httpService.call(
      this.provider.token_url,
      "POST",
      params,
      // no-options
      // no-headers
    );

    // error handling
    if (response.status !== 200) {
      throw new Error(
        `An error occurred requesting an access token ` +
          `from "${this.name}". Please, try again later.`,
      );
    }

    // extract tokens from response
    //@todo "athlete" comes only with Strava, extract to Strava driver
    const { access_token, refresh_token, expires_at, athlete } = response.data;
    return {
      remoteIdentifier: athlete.id,
      accessToken: access_token,
      refreshToken: refresh_token,
      expiresAt: expires_at,
    } as AccessTokenDTO;
  }
}
