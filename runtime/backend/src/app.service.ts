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
import { Injectable } from '@nestjs/common';

/**
 * @class AppService
 * @description The main service of the app.
 *
 * @since v0.1.0
 */
@Injectable()
export class AppService {
  /**
   * The main method that handles requests from default entry point.
   *
   * @returns {string}
   */
  getHello(): string {
    return 'Hello World!';
  }
}
