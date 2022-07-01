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
import { Injectable } from "@nestjs/common";
import { AuthGuard as NestGuard } from "@nestjs/passport";

/**
 * @class AuthGuard
 * @description This trait implements an **authentication guard** that
 * is registered in nest.
 *
 * @todo Investigate whether a PEM-encoded public key makes more sense for *signing tokens* in production environments.
 * @since v0.2.0
 */
@Injectable()
export class AuthGuard extends NestGuard("jwt") {}
