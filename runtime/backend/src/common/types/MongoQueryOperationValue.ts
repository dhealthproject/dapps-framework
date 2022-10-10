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
 * @type MongoQueryOperationValue
 * @description A type that represents *mongo query conditions* individually
 * and is used to perform **safe** database queries with typed conditions.
 *
 * @since v0.3.2
 */
export type MongoQueryOperationValue =
  | boolean
  | boolean[]
  | number
  | number[]
  | string
  | string[]
  | Date
  | null
  | any[];
