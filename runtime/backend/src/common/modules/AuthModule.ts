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
import { MongooseModule } from "@nestjs/mongoose";
import { SchedulerRegistry } from "@nestjs/schedule";

// internal dependencies
import { AppConfiguration } from "../../AppConfiguration";
import { AccountSessionsModule } from "./AccountSessionsModule";
import { ChallengesModule } from "../modules/ChallengesModule";
import { NetworkModule } from "../modules/NetworkModule";
import { QueryModule } from "../modules/QueryModule";
import { LogModule } from "../modules/LogModule";
import { AuthService } from "../services/AuthService";
import { AuthStrategy } from "../traits/AuthStrategy";
import { RefreshStrategy } from "../traits/RefreshStrategy";
import { AuthController } from "../routes/AuthController";
import { ValidateChallengeScheduler } from "../schedulers/ValidateChallengeScheduler";
import {
  AuthChallenge,
  AuthChallengeSchema,
} from "../models/AuthChallengeSchema";
import {
  AccountIntegration,
  AccountIntegrationSchema,
} from "../models/AccountIntegrationSchema";
import { Account, AccountSchema } from "../models/AccountSchema";
import { CipherService } from "../services/CipherService";
import { SocialController } from "../routes/SocialController";
import { AccountsModule } from "./AccountsModule";
import { AuthGateway } from "../gateways/AuthGateway";

// configuration resources
import securityConfigLoader from "../../../config/security";
const auth = securityConfigLoader().auth;

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
    QueryModule,
    AccountsModule,
    AccountSessionsModule,
    ChallengesModule,
    PassportModule,
    LogModule,
    JwtModule.register({
      // defines the secret token for *verifying* JwT tokens
      secret: auth.secret,
      // signature expires after 60 seconds of validity
      signOptions: { expiresIn: "60s" },
    }),
    MongooseModule.forFeature([
      { name: AuthChallenge.name, schema: AuthChallengeSchema },
      { name: Account.name, schema: AccountSchema },
      { name: AccountIntegration.name, schema: AccountIntegrationSchema },
    ]),
    AppConfiguration.getEventEmitterModule(), // requirement from AuthGateway
  ],
  controllers: [AuthController, SocialController],
  providers: [
    AuthService,
    AuthStrategy,
    RefreshStrategy,
    CipherService,
    AuthGateway,
    ValidateChallengeScheduler,
    SchedulerRegistry,
    RefreshStrategy,
  ],
  exports: [AuthService, CipherService],
})
export class AuthModule {}
