/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

// internal dependencies
import { BackendService } from "./BackendService";
import { HttpRequestHandler } from "../kernel/remote/HttpRequestHandler";
import { SocialPlatformDTO } from "../models/SocialPlatformDTO";

/**
 * @class SocialService
 * @description This class handles backend requests for the `/social`
 * namespace and endpoints related to *social platforms*.
 *
 * @since v0.5.0
 */
export class SocialService extends BackendService {
  /**
   * This property sets the request handler used for the implemented
   * requests. This handler forwards the execution of the request to
   * `axios`.
   *
   * @access protected
   * @returns {HttpRequestHandler}
   */
  protected get handler(): HttpRequestHandler {
    return new HttpRequestHandler();
  }

  /**
   * This method fetches the social platform configuration objects
   * from the backend runtime using the `/social/platforms` API.
   *
   * @access public
   * @async
   * @returns   {Promise<SocialPlatformDTO[]>}   An array of social platform configuration objects.
   */
  public async getSocialPlatforms(): Promise<SocialPlatformDTO[]> {
    // fetch from backend runtime
    const response = await this.handler.call(
      this.getUrl(`social/platforms`),
      "GET",
      undefined, // no-body
      undefined,
      {} // no-headers
    );

    // return the list of identifiers
    return response.data;
  }
}
