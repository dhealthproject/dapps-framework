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

export interface BaseConfig {
  dappName: string;
  digitsAmount: number;
  mosaicId: string;
}

/**
 * @label COMMON
 * @class ConfigController
 * @description The social controller of the app. Handles requests
 * about *Configuration details*. Typically, these requests are used by
 * the frontend runtime to get dynamic app configuration.
 *
 * @since v0.5.0
 */
@ApiTags("Configuration endpoints")
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
  getConfig(): BaseConfig {
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
