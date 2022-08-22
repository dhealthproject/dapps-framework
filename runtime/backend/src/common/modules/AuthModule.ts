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
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

// internal dependencies
import { NetworkModule } from "../modules/NetworkModule";
import { AuthService } from "../services/AuthService";
import { AuthStrategy } from "../traits/AuthStrategy";
import { AuthController } from "../routes/AuthController";
import { OAuthController } from "../routes/OAuthController";
import { OAuthService } from "../services/OAuthService";
import { RemoteService } from "../services/RemoteService";

/**
 * @class AuthModule
 * @description The main definition for the Auth module.
 *
 * @todo Investigate whether a PEM-encoded public key makes more sense for *verifying tokens* in production environments.
 * @since v0.2.0
 */
@Module({
  imports: [
    NetworkModule,
    PassportModule,
    JwtModule.register({
      // defines the secret token for *verifying* JwT tokens
      secret: process.env.AUTH_TOKEN_SECRET,
      // signature expires after 60 seconds of validity
      signOptions: { expiresIn: "60s" },
    }),
  ],
  controllers: [AuthController, OAuthController],
  providers: [AuthService, OAuthService, RemoteService, AuthStrategy],
  exports: [AuthService, OAuthService, RemoteService],
})
export class AuthModule {}
