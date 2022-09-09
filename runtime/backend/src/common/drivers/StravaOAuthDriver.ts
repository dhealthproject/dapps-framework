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
import { BasicOAuthDriver } from "./BasicOAuthDriver";
import { OAuthProviderParameters } from "../models/OAuthConfig";

/**
 *
 */
export class StravaOAuthDriver extends BasicOAuthDriver {
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
  public constructor(protected readonly provider: OAuthProviderParameters) {
    super("strava", provider);
  }

  /**
   *
   */
  protected buildAuthorizeQuery(data: string): string {
    return (
      super.buildAuthorizeQuery(data) +
      `&response_type=code` +
      `&approval_prompt=auto`
    );
  }
}
