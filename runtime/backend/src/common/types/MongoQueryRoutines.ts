/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @type MongoRoutineIn
 * @description A type that represents a *mongo routine* using the `$in`
 * operator. This type is used whenever a `$in` routine shall be executed
 * for *number*- or *string*-typed query conditions.
 *
 * @since v0.3.2
 */
export type MongoRoutineIn = {
  $in: number[] | string[];
};

/**
 * @type MongoRoutineCount
 * @description A type that represents a *mongo routine* using the `$count`
 * operator. This type is used whenever a `$count` routine shall be executed
 * i.e. when the result set contains an aggregated total number of entries.
 *
 * @since v0.3.2
 */
export type MongoRoutineCount = {
  $count: string;
};

/**
 * @type MongoRoutineRegex
 * @description A type that represents a *mongo routine* using the `$regex`
 * operator. This type is used whenever a `$regex` condition shall be executed.
 *
 * @since v0.3.2
 */
export type MongoRoutineRegex = {
  $regex: string | RegExp;
};
