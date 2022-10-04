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
import { MongoQueryConditionValue } from "./MongoQueryConditionValue";

/**
 * @type MongoQueryConditions
 * @description A type that consists of a *container* for multiple
 * mongo query conditions that are typed using {@link MongoQueryConditionValue}
 * and used to perform *safe* queries using typed conditions.
 *
 * @since v0.3.2
 */
export type MongoQueryConditions = {
  [key: string]: MongoQueryConditionValue;
};
