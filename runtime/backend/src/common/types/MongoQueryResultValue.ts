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
 * @type MongoQueryResultValue
 * @description A type that represents *mongo result values* individually
 * and is used to type the result set when a mongo query is executed with
 * the `$set` operator.
 *
 * @since v0.3.2
 */
export type MongoQueryResultValue = boolean | number | string | Date | any[];
