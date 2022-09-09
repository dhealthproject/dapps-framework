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
 *
 */
export class BasicOAuthDriver implements OAuthDriver {
  /**
   *
   */
  protected dataFieldName = "state";

  /**
   *
   */
  protected codeFieldName = "code";

  /**
   *
   */
  protected httpService: HttpRequestHandler;

  /**
   *
   */
  public constructor(
    protected readonly name: string,
    protected readonly provider: OAuthProviderParameters,
  ) {
    this.httpService = new HttpRequestHandler();
  }

  /**
   *
   */
  public get providerName(): string {
    return this.name;
  }

  /**
   *
   */
  public get dataField(): string {
    return this.dataFieldName;
  }

  /**
   *
   */
  public get codeField(): string {
    return this.codeFieldName;
  }

  /**
   *
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
   *
   */
  protected buildAuthorizeQuery(data: string): string {
    return (
      `?client_id=${this.provider.client_id}` +
      `&redirect_uri=${encodeURIComponent(this.provider.callback_url)}` +
      `&${this.dataField}=${data}`
    );
  }

  /**
   *
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
