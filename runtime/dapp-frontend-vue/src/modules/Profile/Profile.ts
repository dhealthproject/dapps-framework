/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import { BackendService } from "@/service/BackendService";
import { AxiosResponse } from "axios";

export class Profile extends BackendService {
  /**
   * @returns Promise
   *
   * Api method for getting user profile
   */
  public async getMe(): Promise<AxiosResponse<any, any> | undefined> {
    const authHeader = this.getAuthCookie();
    if (authHeader) {
      const response = await this.handler.call("GET", this.getUrl("me"), {});
      return response;
    }
  }
}
