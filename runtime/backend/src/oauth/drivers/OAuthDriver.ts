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
// common scope
import { HttpMethod } from "../../common/drivers/HttpRequestHandler";
import { AccessTokenDTO } from "../../common/models/AccessTokenDTO";
import { ResponseStatusDTO } from "../../common/models/ResponseStatusDTO";

// oauth scope
import { OAuthEntity, OAuthEntityType } from "./OAuthEntity";

/**
 * @interface OAuthDriver
 * @description This interface defines the fields and methods of an
 * **OAuth** driver which determines communication, transport and
 * process that are used to connect and integrate to custom providers.
 *
 * @since v0.3.0
 */
export interface OAuthDriver {
  /**
   * Getter of the driver's data field name.
   *
   * @access public
   * @var {string}
   */
  get dataField(): string;

  /**
   * Getter of the driver's code field name.
   *
   * @access public
   * @var {string}
   */
  get codeField(): string;

  /**
   * Getter that determines whether this driver
   * uses *seconds* (rather than milliseconds) to
   * express a timestamp in UTC format.
   *
   * @access public
   * @var {boolean}
   */
  get usesUTCSecondsToEpoch(): boolean;

  /**
   * Method to return the authorize url of this driver's provider.
   *
   * @access public
   * @param   {string}  extra   The `data` field value to include in this query.
   * @returns {string}          The full authorize url to send request to.
   */
  getAuthorizeURL(extra: string): string;

  /**
   * Method to return the access token from the driver's provider.
   *
   * @access public
   * @async
   * @param   {string}      code        The required `code` field value.
   * @param   {string}      data        The required `data` field value.
   * @returns {Promise<AccessTokenDTO>} A promise containing the result {@link AccessTokenDTO}.
   */
  getAccessToken(code: string, data?: string): Promise<AccessTokenDTO>;

  /**
   * Method to return an updated access token from the driver's provider
   * using a refresh token.
   *
   * @access public
   * @async
   * @param   {string}      refreshToken        The user's refresh token.
   * @returns {Promise<AccessTokenDTO>} A promise containing the result {@link AccessTokenDTO}.
   */
  updateAccessToken(refreshToken?: string): Promise<AccessTokenDTO>;

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
  executeRequest(
    accessToken: string,
    endpointUri: string,
    method?: HttpMethod,
    body?: any,
    options?: any,
    headers?: any,
  ): Promise<ResponseStatusDTO>;

  /**
   * Method to transform an *entity* as described by the data provider
   * API. Typically, this method is used to handle the transformation
   * of remote objects (from data provider API) to internal objects in
   * the backend runtime's database.
   * <br /><br />
   * e.g. This method is used to transform *activity data* as defined
   * by the Strava API, into {@link ActivityData} as defined internally.
   *
   * @access public
   * @param   {any}               data      The API Response object that will be transformed.
   * @param   {OAuthEntityType}   type      The type of entity as described in {@link OAuthEntityType}.
   * @returns {OAuthEntity}       A parsed entity object.
   */
  getEntityDefinition(data: any, type?: OAuthEntityType): OAuthEntity;
}
