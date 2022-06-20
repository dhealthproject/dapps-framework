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
import { Body, Controller, Ip, Get, Post, Request, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

// internal dependencies
import { AppService } from "./AppService";
import { AuthService } from "./common/services/AuthService";
import { ChainGuard } from "./common/traits/ChainGuard";
import { AuthGuard } from "./common/traits/AuthGuard";
import { User } from "./common/models/User";
import { TokenRequestDTO } from "./common/models/TokenRequestDTO";

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
    private readonly authService: AuthService,
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

  /**
   * 
   * @param req 
   * @param ip 
   * @param body 
   * @returns 
   */
  @Post('auth/token')
  protected async getToken(
    @Request() req: any,
    @Ip() ip: string,
    @Body() body: TokenRequestDTO
  ) {
    const user: User = await this.authService.validate(
      body.address,
      body.authCode,
    );

    if (null !== user) {
      return this.authService.getAccessToken(user);
    }
  }

  /**
   * 
   * @param req 
   * @returns 
   */
  @UseGuards(AuthGuard)
  @Get('me')
  protected getProfile(@Request() req: any) {
    return req.user;
  }
}
