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
import {
  MongoQueryOperation,
  MongoQueryOperationSpec,
} from "./MongoQueryOperation";

/**
 * @type MongoQueryOperations
 * @description A type that consists of a *container* for multiple
 * mongo query operations, e.g. `$ne` or `$eq` that are typed using
 * {@link MongoQueryOperation} and used to perform *safe* queries
 * using typed operations.
 *
 * @since v0.3.2
 */
export type MongoQueryOperations = {
  [key: MongoQueryOperationSpec | string]: MongoQueryOperation;
};
