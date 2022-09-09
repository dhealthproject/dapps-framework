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
import { AccessTokenDTO } from "../models/AccessTokenDTO";

/**
 *
 */
export interface OAuthDriver {
  /**
   *
   */
  get dataField(): string;

  /**
   *
   */
  get codeField(): string;

  /**
   *
   */
  getAuthorizeURL(extra: string): string;

  /**
   *
   */
  getAccessToken(code: string, data?: string): Promise<AccessTokenDTO>;
}
