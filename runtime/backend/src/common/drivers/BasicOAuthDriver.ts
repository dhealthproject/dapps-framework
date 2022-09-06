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
  public constructor(protected readonly provider: OAuthProviderParameters) {}

  /**
   *
   */
  public get dataField(): string {
    return this.dataFieldName;
  }

  /**
   *
   */
  public getAuthorizeURL(extra: string): string {
    // prepare the OAuth "authorization" URL
    return (
      `${this.provider.oauth_url}` +
      // pass any extra(s) in "state" by default
      `${this.buildHttpQuery(extra)}` +
      // *always* pass a "scope" (OAuth Scope)
      `&scope=${this.provider.scope}`
    );
  }

  /**
   *
   */
  public buildHttpQuery(data: string): string {
    return (
      `?client_id=${this.provider.client_id}` +
      `&redirect_uri=${encodeURIComponent(this.provider.callback_url)}` +
      `&${this.dataField}=${data}`
    );
  }
}
