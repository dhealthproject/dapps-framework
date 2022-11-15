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
import { ObjectLiteral } from "@dhealth/contracts";

// internal dependencies
import { UserStatisticsFields } from "./UserStatisticsFields";

/**
 * @type StatisticsDataType
 * @description This type defines a type that is used for the column
 * with name `data` in {@link Statistics}.
 *
 * @since v0.5.0
 */
export type StatisticsDataType = ObjectLiteral | UserStatisticsFields;
