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
import { BasicOAuthDriver } from "./BasicOAuthDriver";
import { OAuthProviderParameters } from "../models/OAuthConfig";

/**
 * @class StravaOAuthDriver
 * @description The dApp's `Strava` OAuth driver. This class is
 * used to determine communication, transport and process to
 * connect and integrate to the `Strava` provider.
 *
 * @since v0.3.0
 */
export class StravaOAuthDriver extends BasicOAuthDriver {
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
   * The driver's value to determine whether seconds are used to express
   * UTC timestamps (if set to false, milliseconds are used). This field
   * indicates the type of timestamp returned with this driver.
   * <br /><br />
   * This Strava OAuth implementation uses *seconds since epoch* when it
   * expresses/returns UTC timestamps that represent an access token's
   * expiration time.
   *
   * @see https://developers.strava.com/docs/authentication/#response-parameters
   * @access protected
   * @var {boolean}
   */
  protected usesSecondsUTC = true;

  /**
   * Constructs an instance of this driver.
   *
   * @access public
   * @constructor
   * @param {OAuthProviderParameters} provider The Strava provider's subscription parameters.
   */
  public constructor(protected readonly provider: OAuthProviderParameters) {
    super("strava", provider);
  }

  /**
   * Method to return the authorize query to this driver's provider.
   * This is the query parameters that will be included after the
   * authorized url.
   * <br /><br />
   * Note that in addition to the query parameters included in the
   * super class {@link BasicOAuthDriver}, this method also adds two
   * new parameters `response_type=code` and `approval_prompt=auto`.
   *
   * @access protected
   * @param   {string}  data  The `data` value to include in this query.
   * @returns {string}        The full query parameters.
   */
  protected buildAuthorizeQuery(data: string): string {
    return (
      super.buildAuthorizeQuery(data) +
      `&response_type=code` +
      `&approval_prompt=auto`
    );
  }

  /**
   * Helper method that extracts access- and refresh tokens, and
   * expiration time of the access token from a HTTP response.
   * <br /><br />
   * This method overload permits to extract *additional* data
   * from the response object as it *may* be included by Strava.
   * <br /><br />
   * Note that this overload *calls* the {@link BasicOAuthDriver.extractFromResponse} method
   * to extract mandatory token information from the response.
   *
   * @access protected
   * @param   {any}     data    The HTTP response data (parsed JSON object).
   * @returns {AccessTokenDTO}  A resulting {@link AccessTokenDTO} object.
   */
  protected extractFromResponse(data: any): AccessTokenDTO {
    // extract mandatory OAuth access token request fields
    const tokenDTO = super.extractFromResponse(data);

    // add athlete information if available (STRAVA-only)
    if ("athlete" in data && undefined !== data["athlete"]) {
      tokenDTO["remoteIdentifier"] = data["athlete"].id;
    }

    return tokenDTO;
  }
}
