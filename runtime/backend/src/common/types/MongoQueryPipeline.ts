/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import {
  MongoPipelineFacet,
  MongoPipelineMatch,
  MongoPipelineSet,
} from "./MongoPipelineStages";

/**
 * @type MongoQueryPipelineStage
 * @description A type that represents *mongo query pipeline stages*. A pipeline
 * stage consists of one *mongo routines* that impacts the result set that a
 * query execution will return.
 *
 * @since v0.3.2
 */
export type MongoQueryPipelineStage =
  | MongoPipelineMatch
  | MongoPipelineFacet
  | MongoPipelineSet;

/**
 * @type MongoQueryPipeline
 * @description A type that represents *mongo query pipelines*. A pipeline
 * typically consists of one or more *mongo routines* that impact the result
 * set that the query execution will return.
 *
 * @since v0.3.2
 */
export type MongoQueryPipeline = (MongoQueryPipelineStage | MongoQueryUnion)[];

/**
 * @type MongoPipelineUnion
 * @description A type that represents a *union pipeline* used for preparing
 * the result set that will be *aggregated*. This type notably configures
 * the **collection name** of an individual union *group*.
 * <br /><br />
 * Note that the `_id` field is obligatory in the *union group*, as well
 * as the `coll` - collection name - and the *query pipeline stages*
 *
 * @since v0.3.2
 */
export type MongoQueryUnion = {
  $unionWith: {
    coll: string; // collection name
    pipeline: (MongoQueryPipelineStage | { $group: any & { _id: string } })[];
  };
};
