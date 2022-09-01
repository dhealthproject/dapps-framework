/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { AxiosResponse } from "axios";

// internal dependencies
import { AuthService } from "./AuthService";
import { BackendService } from "./BackendService";
import { UnauthorizedError } from "@/kernel/errors/UnauthorizedError";
import { HttpRequestHandler } from "@/kernel/remote/HttpRequestHandler";

export class ProfileService extends BackendService {
  /**
   *
   */
  private accessToken: string;

  /**
   *
   */
  public constructor() {
    super();

    // reads the access token from browser cookies
    this.accessToken = AuthService.getAccessToken();
  }

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
   * Api method for getting user profile
   *
   * @returns Promise
   */
  public async getMe(): Promise<AxiosResponse<any, any> | undefined> {
    // error out if access unauthorized
    if (!this.accessToken || !this.accessToken.length) {
      throw new UnauthorizedError("Unauthorized");
    }

    const response = await this.handler.call(
      this.getUrl("me"),
      "GET",
      {},
      {},
      {
        Authorization: `Bearer ${this.accessToken}`,
      }
    );

    return response;
  }
}
