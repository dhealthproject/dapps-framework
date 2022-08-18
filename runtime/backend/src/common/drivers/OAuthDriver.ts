/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
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
  getAuthorizeURL(oauth_url: string, extra: string): string;

  /**
   *
   */
  buildHttpQuery(data: string): string;
}
