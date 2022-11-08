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
import {
  Controller,
  Get,
  Param,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import { SocialConfig } from "../models/SocialConfig";
import { SocialPlatformDTO } from "../models/SocialPlatformDTO";

// config resources
import socialConfigLoader from "../../../config/social";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/auth/challenge`
  export const SocialShareResponseSchema = {
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(SocialPlatformDTO) },
            },
          },
        },
      ],
    },
  };
}

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
 * | `/social/share` | **`GET`** | {@link SocialController.share} | Responds with a {@link SocialPlatformDTO} object that contains a social platforms link details. |
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
   * @constructor
   * @param {ConfigService} configService
   */
  public constructor(private readonly configService: ConfigService) {}

  /**
   * This method returns a {@link SocialPlatformDTO} object that contains
   * information about a social platform's links to *share content*.
   * <br /><br />
   * Note that future iterations *may* use a browser redirection here or
   * provide a redirection capacity.
   *
   * @method GET
   * @access protected
   * @async
   * @param   {string}    platform    The name of the social platform, e.g. "facebook", "twitter", etc.
   * @returns {Promise<SocialPlatformDTO>}   A social platform configuration object.
   */
  @Get("share/:platform")
  @ApiOperation({
    summary: "Social Platform Share",
    description:
      "Request a social platform share URL as used to *share content* on a social platform.",
  })
  @ApiExtraModels(SocialPlatformDTO)
  @ApiOkResponse(HTTPResponses.SocialShareResponseSchema)
  protected share(@Param("platform") platform: string): SocialPlatformDTO {
    // deny unknown platforms
    const socialConfig: SocialConfig = socialConfigLoader();
    if (
      undefined === socialConfig ||
      !("socialApps" in socialConfig) ||
      !(platform in socialConfig.socialApps)
    ) {
      throw new HttpException("Bad Request", HttpStatus.BAD_REQUEST);
    }

    // read the platform's configuration
    const integration = this.configService.get<SocialPlatformDTO>(
      `socialApps.${platform}`,
    );

    // contains `title`,  `shareUrl`, `appUrl`, ..
    return integration;
  }
}
