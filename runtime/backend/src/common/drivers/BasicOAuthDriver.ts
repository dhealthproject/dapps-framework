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
import { OAuthProviderParameters } from "../models/OAuthConfig";
import { AccessTokenDTO } from "../models/AccessTokenDTO";
import { HttpRequestHandler } from "./HttpRequestHandler";

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
   * @param {string} name
   * @param {OAuthProviderParameters} provider
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
   * @var {string}
   */
  public get providerName(): string {
    return this.name;
  }

  /**
   * Getter of this driver's data field name.
   *
   * @access public
   * @var {string}
   */
  public get dataField(): string {
    return this.dataFieldName;
  }

  /**
   * Getter of this driver's code field name.
   *
   * @access public
   * @var {string}
   */
  public get codeField(): string {
    return this.codeFieldName;
  }

  /**
   * Method to return the authorize url of this driver's provider.
   *
   * @access public
   * @var {string}
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
   * Method to return the remote access token.
   * The result is an access/refresh token pair or an access token.
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
    // @todo forward `expires_in` and/or `expires_at`
    const { access_token, refresh_token } = response.data;
    return {
      accessToken: access_token,
      refreshToken: refresh_token,
    } as AccessTokenDTO;
  }
}
