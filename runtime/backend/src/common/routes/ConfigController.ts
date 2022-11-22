/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import { AssetParameters } from "../models";

/**
 * @label COMMON
 * @class SocialController
 * @description The social controller of the app. Handles requests
 * about *social platforms*. Typically, these requests are used by
 * the frontend runtime to determine dynamic referral links.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/social/platforms` | **`GET`** | {@link SocialController.find} | Responds with a {@link SocialPlatformDTO} object that contains a social platforms link details. |
 * | `/social/share/:provider` | **`GET`** | {@link SocialController.share} | Responds with a {@link SocialPlatformDTO} object that contains a social platforms link details. |
 * <br /><br />
 *
 * @since v0.5.0
 */
@ApiTags("Social Platforms")
@Controller("social")
export class SocialController {
  /**
   * Constructs an instance of this controller.
   *
   * @param {ConfigService} configService   A nestjs ConfigService instance (automatically injected).
   */
  public constructor(private readonly configService: ConfigService) {}

  @Get("config")
  getConfig() {
    const dappName = this.configService.get<string>("dappName");
    const asset = this.configService.get<AssetParameters>("assets.earn");
    const mosaicId = asset.mosaicId;
    return {
      dappName,
      digitsAmount: 2,
      mosaicId,
    };
  }
}
