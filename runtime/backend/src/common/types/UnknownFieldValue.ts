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
 * @type UnknownFieldValue
 * @description A type that represents data that is *largely* typed and
 * thereby **unsafe**. This type is used internally *before* type-casting
 * the mongo query conditions using {@link MongoQueryConditions}.
 *
 * @since v0.3.2
 */
export type UnknownFieldValue = boolean | number | string | any[] | null | any;
