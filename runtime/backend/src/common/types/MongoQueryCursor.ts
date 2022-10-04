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
 * @type MongoQueryCursor
 * @description A type that represents data about *pagination*, *offset*
 * and *limit* for mongo database queries.
 *
 * @since v0.3.2
 */
export type MongoQueryCursor = {
  page: number;
  limit: number;
  skip: number;
};
