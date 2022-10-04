/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { UnknownFieldValue } from "./UnknownFieldValue";

/**
 * @type UnsafeQueryConditions
 * @description A type that represents data that is *largely* typed and
 * thereby **unsafe**, formatted into a *query condition* format. This
 * type is used internally *before* type-casting the mongo query conditions
 * using {@link MongoQueryConditions}.
 *
 * @since v0.3.2
 */
export type UnsafeQueryConditions = {
  [key: string]: UnknownFieldValue;
};
