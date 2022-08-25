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
import { MongooseModule } from "@nestjs/mongoose";

// internal dependencies
import { QueryModule } from "../../common/modules/QueryModule";
import { ChallengesService } from "../services/ChallengesService";
import {
  AuthChallenge,
  AuthChallengeSchema,
} from "../models/AuthChallengeSchema";

/**
 * @label COMMON
 * @class ChallengesModule
 * @description The main definition for the Accounts module.
 *
 * @since v0.3.0
 */
@Module({
  providers: [ChallengesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: AuthChallenge.name,
        schema: AuthChallengeSchema,
      },
    ]),
    QueryModule,
  ],
  exports: [ChallengesService],
})
export class ChallengesModule {}
