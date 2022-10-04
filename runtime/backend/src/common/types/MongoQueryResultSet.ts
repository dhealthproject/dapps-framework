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
import { MongoQueryResultValue } from "./MongoQueryResultValue";

/**
 * @type MongoQueryResultSet
 * @description A type that consists of a *container* for multiple
 * mongo result values that are typed using {@link MongoQueryResultValue}
 * and used to type the result set of a mongo query.
 *
 * @since v0.3.2
 */
export type MongoQueryResultSet = {
  [key: string]: MongoQueryResultValue;
};
