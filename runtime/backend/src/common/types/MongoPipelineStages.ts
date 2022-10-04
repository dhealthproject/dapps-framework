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
import { MongoQueryConditions } from "./MongoQueryConditions";
import { MongoRoutineCount } from "./MongoQueryRoutines";
import { MongoQueryResultSet } from "./MongoQueryResultSet";

/**
 * @type MongoPipelineMatch
 * @description A type that represents a *mongo pipeline stage* that
 * uses the `$match` operator. This type is used whenever a search query
 * shall be executed for any type of query conditions.
 *
 * @since v0.3.2
 */
export type MongoPipelineMatch = {
  $match: MongoQueryConditions;
};

/**
 * @type MongoPipelineFacet
 * @description A type that represents a *mongo routine* used for preparing
 * the result set that will be *aggregated*. This type notably configures
 * the **pagination** of an individual mongo query and possible enables the
 * `$count` routine with the corresponding field name in the result set.
 *
 * @since v0.3.2
 */
export type MongoPipelineFacet = {
  $facet: {
    data: (
      | { $skip: number }
      | { $limit: number }
      | { $sort: Record<string, { $meta: "textScore" } | 1 | -1> }
    )[];
    metadata?: MongoRoutineCount[];
  };
};

/**
 * @type MongoPipelineSet
 * @description A type that represents a *mongo routine* used for preparing
 * an *update* (or creation) of new field values.
 *
 * @since v0.3.2
 */
export type MongoPipelineSet = {
  $set: MongoQueryResultSet;
};
