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
import { HttpMethod } from "./HttpRequestHandler";
import { AccessTokenDTO } from "../models/AccessTokenDTO";
import { ResponseStatusDTO } from "../models/ResponseStatusDTO";

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
   * Method to return the authorize url of this driver's provider.
   *
   * @access public
   * @var {string}
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
}
