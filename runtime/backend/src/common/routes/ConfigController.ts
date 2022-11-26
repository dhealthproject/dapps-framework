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
import { ConfigService } from "@nestjs/config";
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";

// internal dependencies
import { DappConfigDTO } from "../models/DappConfigDTO";
import { AssetParameters } from "../models";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of `/config`
  export const ConfigFindResponseSchema = {
    schema: {
      allOf: [
        {
          properties: {
            data: {
              type: "array",
              items: { $ref: getSchemaPath(DappConfigDTO) },
            },
          },
        },
      ],
    },
  };
}

/**
 * @label COMMON
 * @class ConfigController
 * @description The configuration controller of the app. Handles requests
 * about *Configuration of a dApp*. Typically, these requests are used by
 * the frontend runtime to get dynamic app configuration.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/config` | **`GET`** | {@link ConfigController.find} | Responds with a {@link DappConfigDTO} object that contains a dApp's important (non-sensitive) configuration field. |
 * <br /><br />
 *
 * @since v0.5.0
 */
@ApiTags("Configuration")
@Controller("config")
export class ConfigController {
  /**
   * Constructs an instance of this controller.
   *
   * @param {ConfigService} configService   A nestjs ConfigService instance (automatically injected).
   */
  public constructor(private readonly configService: ConfigService) {}

  /**
   * Returns base configuration for the frontend app.
   *
   * @param {ConfigService} configService   A nestjs ConfigService instance (automatically injected).
   * @returns {BaseConfig}
   */
  @Get()
  @ApiOperation({
    summary: "Request dApp configuration details",
    description:
      "Request a configuration object that describe a hosted dApp and is " +
      "used to configure the frontend display capacities.",
  })
  @ApiExtraModels(DappConfigDTO)
  @ApiOkResponse(HTTPResponses.ConfigFindResponseSchema)
  find(): DappConfigDTO {
    // read configuration from backend runtime
    const dappName = this.configService.get<string>("dappName");
    const asset = this.configService.get<AssetParameters>("assets.earn");
    const authRegistry = this.configService.get<string[]>("auth.registries");

    // transform to DTO
    return {
      dappName,
      authRegistry: authRegistry[0], // @todo should return many
      earnAssetDivisibility: asset.divisibility,
      earnAssetIdentifier: asset.mosaicId,
    } as DappConfigDTO;
  }
}
