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
import { MongoQueryOperationValue } from "./MongoQueryOperationValue";

/**
 * @type MongoOperationEqual
 * @description A type that represents a *mongo query operations* using
 * the `$eq`-operator that matches documents based of a field value.This
 * type is used whenever a `$eq` operation shall be executed for filters
 * additionally to query conditions.
 *
 * @since v0.3.2
 */
export type MongoOperationEqual = {
  $eq: MongoQueryOperationValue;
};

/**
 * @type MongoOperationNotEqual
 * @description A type that represents a *mongo query operations* using
 * the `$ne`-operator that matches documents based of a field value.This
 * type is used whenever a `$eq` operation shall be executed for filters
 * additionally to query conditions.
 *
 * @since v0.3.2
 */
 export type MongoOperationNotEqual = {
  $ne: MongoQueryOperationValue;
};

/**
 * @type MongoOperationExists
 * @description A type that represents a *mongo query operations* using
 * the `$eq`-operator that matches documents based of a field value.This
 * type is used whenever a `$eq` operation shall be executed for filters
 * additionally to query conditions.
 *
 * @since v0.3.2
 */
export type MongoOperationExists = {
  $exists: boolean;
};

/**
 * @type MongoOperationSet
 * @description A type that represents a *mongo query operations* using
 * the `$set`-operator that updates document field values. This type is
 * used whenever a `$set` operation shall be executed to create or update
 * individual field values.
 *
 * @since v0.3.2
 */
export type MongoOperationSet = {
  $set: Record<string, MongoQueryOperationValue>;
};

/**
 * @type MongoOperationInc
 * @description A type that represents a *mongo query operations* using
 * the `$inc`-operator that updates document field values by *incrementing*
 * it as defined in the specification object. This type is used whenever a
 * `$inc` operation shall be executed to *increment* field values.
 *
 * @since v0.3.2
 */
export type MongoOperationInc = {
  $inc: Record<string, number>;
};

/**
 * @type MongoOperationDec
 * @description A type that represents a *mongo query operations* using
 * the `$dec`-operator that updates document field values by *decrementing*
 * it as defined in the specification object. This type is used whenever a
 * `$dec` operation shall be executed to *decrement* field values.
 *
 * @since v0.3.2
 */
export type MongoOperationDec = {
  $inc: Record<string, number>;
};

/**
 * @type MongoQueryOperation
 * @description A type that represents *mongo query operations* individually
 * and is used to perform **safe** database queries with typed operations.
 * <br /><br />
 * Mongo operations that are currently supported include:
 * - `$eq`: This operation consists of matching documents by `equality` of a field value.
 * - `$ne`: This operation consists of matching documents for which *a field is not null*.
 * - `$exists`: This operation consists for matching documents for which *a field exists and is not null*.
 * <br /><br />
 * @example Using the `MongoOperationEqual` operator
 * ```json
 * // performs a "non-null" query on field `fieldName`
 * { "fieldName": { $ne: null } }
 * ```
 *
 * @since v0.3.2
 */
export type MongoQueryOperation =
  | MongoOperationEqual
  | MongoOperationNotEqual
  | MongoOperationExists
  | MongoOperationSet
  | MongoOperationInc
  | MongoOperationDec;

/**
 * @type MongoQueryOperationSpec
 * @description A type that represents *mongo query operations raw specification*
 * and is used to perform **safe** database query with added typed operations.
 *
 * @since v0.3.2
 */
export type MongoQueryOperationSpec =
  | keyof MongoOperationEqual
  | keyof MongoOperationNotEqual
  | keyof MongoOperationExists
  | keyof MongoOperationSet
  | keyof MongoOperationInc
  | keyof MongoOperationDec;
