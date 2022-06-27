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

// internal dependencies
import { AppService } from "./AppService";

// configuration resources
import dappConfigLoader from "../config/dapp";

/**
 * @class AppController
 * @description The main controller of the app. Handles requests
 * from the default entry endpoint and pass on to the app service.
 *
 * @since v0.1.0
 */
@Controller()
export class AppController {
  /**
   * The currently configured dApp that this backend runtime
   * is serving for.
   *
   * @access protected
   * @var {string}
   */
  protected dappName: string;

  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param {ConfigService} configService
   * @param {AppService} appService
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly appService: AppService,
  ) {
    // read from configuration fields
    this.dappName = dappConfigLoader().dappName;
  }

  /**
   * The handler of the app's default entry point.
   * It calls the service to return app information.
   *
   * @method GET
   * @returns {string}
   */
  @Get('hello')
  protected getHello(): string {
    return `Hello, world of ${this.dappName}!`;
  }
}
