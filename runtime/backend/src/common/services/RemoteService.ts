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
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";

type Method = "GET" | "POST" | "PUT" | "PATCH";

@Injectable()
export class RemoteService {
  public constructor(protected readonly configService: ConfigService) {}

  async remoteCall(
    method: Method,
    url: string,
    options: any,
    provider: string,
  ) {
    const baseUrl = this.configService.get<string>(`${provider}.base_url`);
    console.log({ baseUrl });
    try {
      if (method === "GET") {
        return await axios.get(`${baseUrl}/${url}`, {
          ...options,
        });
      }
      // POST PUT PATCH
      else {
        return await axios({
          method: method.toLowerCase(),
          url: `${baseUrl}/${url}`,
          data: {
            ...options,
          },
        });
      }
    } catch (err) {
      console.log("Request failed: ", err);
      throw err;
    }
  }
}
