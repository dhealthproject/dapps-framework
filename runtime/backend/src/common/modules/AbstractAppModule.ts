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
import { ModuleMetadata } from "@nestjs/common";

/**
 * @label COMMON
 * @class AbstractAppModule
 * @description The main definition for the AbstractAppModule module.
 * @see https://github.com/nestjs/nest/blob/master/packages/common/interfaces/modules/module-metadata.interface.ts
 *
 * @abstract
 * @since v0.5.6
 */
export abstract class AbstractAppModule implements ModuleMetadata {}
