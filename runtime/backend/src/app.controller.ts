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
import { Controller, Get } from '@nestjs/common';

// internal dependencies
import { AppService } from './app.service';

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
   * The constructor of the controlller.
   * Injected with the service instance.
   *
   * @constructor
   * @param {AppService} appService
   */
  constructor(private readonly appService: AppService) {}

  /**
   * The handler of the app's default entry point.
   * It calls the service to return app information.
   *
   * @method GET
   * @returns {string}
   */
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
