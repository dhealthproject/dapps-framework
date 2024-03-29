/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Injectable } from "@nestjs/common";
import { Model, FilterQuery, PipelineStage, Aggregate } from "mongoose";

// internal dependencies
import { Documentable } from "../concerns/Documentable";
import { Queryable } from "../concerns/Queryable";
import { PaginatedResultDTO } from "../models/PaginatedResultDTO";
import { UnknownFieldValue } from "../types/UnknownFieldValue";
import { UnsafeQueryConditions } from "../types/UnsafeQueryConditions";
import { MongoQueryConditions } from "../types/MongoQueryConditions";
import { MongoQueryConditionValue } from "../types/MongoQueryConditionValue";
import { MongoQueryCursor } from "../types/MongoQueryCursor";
import { MongoQueryPipeline } from "../types/MongoQueryPipeline";
import { MongoRoutineCount, MongoRoutineIn } from "../types/MongoQueryRoutines";
import { MongoPipelineFacet } from "../types/MongoPipelineStages";
import { MongoQueryOperations } from "../types/MongoQueryOperations";

/**
 * @type SearchQuery
 * @description Query configuration object that is intended to separate
 * Mongo query configuration from sorting and pagination (cursor) logic
 * using native types.
 * <br /><br />
 * This class may be used to create custom search queries that can be
 * executed againt a running Mongo service.
 *
 * @since v0.1.0
 */
export type SearchQuery = {
  queryCursor: MongoQueryCursor;
  querySorter: Record<string, 1 | -1 | { $meta: "textScore" }>;
  searchQuery: MongoQueryConditions;
};

/**
 * @class QueryService
 * @description Abstraction layer for queries setup using the Mongo
 * service. This class contains methods to validate, process and
 * format database queries.
 * <br /><br />
 * Native field values *will* be casted to their Typescript equivalent
 * depending on the field value in Mongo, i.e. `"true"` becomes `true`.
 * <br /><br />
 * Also, arrays are *always* passed to the `$in` routine, currently no
 * other operations are possible with array and objects.
 * <br /><br />
 * Note that you must pass a *document class* to the generic `TDocument`
 * template of this class, e.g. QueryService<StateDocument>.
 * <br /><br />
 * @example Inject and use the QueryService in another class
 * ```typescript
 *  import { QueryService } from "./QueryService";
 *
 *  @Injectable()
 *  export class ExampleService {
 *    // inject QueryService
 *    constructor(
 *      @InjectModel(Example.name) private readonly model: ExampleModel,
 *      private readonly queryService: QueryService<ExampleDocument, ExampleModel>,
 *    ) {}
 *
 *    // example usage
 *    async findOne(query: ExampleQuery): Promise<ExampleDocument> {
 *      return await this.queryService.findOne(query, this.model);
 *    }
 *  }
 * ```
 *
 * @todo add handler abstraction logic
 * @todo Method `typecastField` does not permit *simple* arithmetical operations like `<><==>` on numbers.
 * @todo Method `typecastField` is most likely incompatible with complex class objects, must be handled.
 * @todo Method `typecastField` *mixes* functionalities by defining the `$in` routines as a type-cast result.
 * @since v0.1.0
 */
@Injectable()
export class QueryService<
  TDocument extends Documentable,
  TModel extends Model<TDocument, {}, {}, {}> = Model<TDocument>,
> {
  /**
   * This method executes a *count* query using the {@link model}
   * argument.
   * <br /><br />
   * Caution: Count queries require a considerable amount of RAM
   * to execute. It is preferred to use pro-active statistics with
   * collections that contain one document with a counter.
   *
   * @access public
   * @async
   * @param   {Queryable<TDocument>}  query
   * @param   {TModel}                model
   * @returns {Promise<number>}   The number of matching documents.
   */
  public async count(
    query: Queryable<TDocument>,
    model: TModel,
  ): Promise<number> {
    // wrap query to be mongo-compatible
    const { searchQuery } = this.getQueryConfig(query);
    return await model.count(searchQuery as FilterQuery<TDocument>);
  }

  /**
   * Method to query the *existence* of a document in the
   * collection mapped to {@link TModel}.
   * <br /><br />
   * This executes a *lean* mongoose query such that the
   * properties of the returned document are *reduced* to
   * only the `"_id"` field.
   *
   * @access public
   * @async
   * @param   {Queryable<TDocument>}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {TModel}  model     The model *class instance* used for matching documents.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  public async exists(
    query: Queryable<TDocument>,
    model: TModel,
  ): Promise<boolean> {
    // executes a *lean* mongoose findOne query
    const document: TDocument = await this.findOne(
      query,
      model,
      true, // stripDocument ("lean query")
    );

    // https://simplernerd.com/typescript-convert-bool/
    return !!document;
  }

  /**
   * Create a generic *search query* that is compatible with Mongo. The
   * returned {@link PaginatedResultDto} contains a `data` field and a
   * `pagination` field to permit multiple queries to be sequenced.
   * <br /><br />
   * This method also *executes* the search query using the Mongo service
   * connected to handle {@param model}.
   *
   * @access public
   * @async
   * @param   {Queryable<TDocument>}         query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {TModel}  model     The model *class instance* used for resulting documents.
   * @returns {Promise<PaginatedResultDTO<TDocument>>} The matching documents after execution of the query.
   */
  public async findWithTotal(
    query: Queryable<TDocument>,
    model: TModel,
    ops: MongoQueryOperations = undefined,
  ): Promise<PaginatedResultDTO<TDocument>> {
    // wrap pagination+query to be mongo-compatible
    const { queryCursor } = this.getQueryConfig(query);

    // prepare an *aggregate* query compatible with
    // the *mongoose* `Model`'s `aggregate()` method
    // undefined is used to disable *union query mode*.
    const aggregateQuery = this.getAggregateFindQuery(query, undefined, [
      { $count: "total" },
    ]);

    // add operations to query, e.g. `$ne`, `eq`, `$exists`
    if (ops !== undefined) {
      Object.keys(ops).forEach(
        (k: string, ix: number) => (aggregateQuery[ix] = ops[k]),
      );
    }

    // execute Mongo query
    const [{ data, metadata }] = await model
      .aggregate(
        [...aggregateQuery] as any, // any for mongoose' `PipelineStage`
      )
      .exec();

    // build pagination details for PaginatedResultDTO
    const pagination = {
      pageNumber: queryCursor.page + 1,
      pageSize: queryCursor.limit,
      total: metadata.length > 0 ? metadata[0].total : 0,
    };

    // returns wrapped entity page
    return PaginatedResultDTO.create<TDocument>(data, pagination);
  }

  /**
   * Create a generic *search query* that is compatible with Mongo. The
   * returned {@link PaginatedResultDto} contains a `data` field and a
   * `pagination` field to permit multiple queries to be sequenced.
   * <br /><br />
   * This method also *executes* the search query using the Mongo service
   * connected to handle {@param model}.
   *
   * @access public
   * @async
   * @param   {Queryable<TDocument>}         query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {TModel}  model     The model *class instance* used for resulting documents.
   * @returns {Promise<PaginatedResultDTO<TDocument>>} The matching documents after execution of the query.
   */
  public async find(
    query: Queryable<TDocument>,
    model: TModel,
  ): Promise<PaginatedResultDTO<TDocument>> {
    // wrap pagination+query to be mongo-compatible
    const { queryCursor, searchQuery } = this.getQueryConfig(query);

    // execute Mongo query
    const data = await model.find(searchQuery as FilterQuery<TDocument>).exec();

    // build pagination details for PaginatedResultDTO
    const pagination = {
      pageNumber: queryCursor.page + 1,
      pageSize: queryCursor.limit,
    };

    // returns wrapped entity page
    return PaginatedResultDTO.create<TDocument>(data, pagination);
  }

  /**
   * Find one `TDocument` instance in the database and use
   * a query based on the {@link Queryable} class.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {Queryable<TDocument>}    query           The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {TModel}                  model           The model *class instance* used for the resulting document.
   * @param   {boolean}                 stripDocument   Determines whether the query should be lean (strip out document properties).
   * @returns {Promise<TDocument>}  The resulting document.
   */
  public async findOne(
    query: Queryable<TDocument>,
    model: TModel,
    stripDocument = false,
  ): Promise<TDocument | null> {
    // wrap pagination+query to be mongo-compatible
    const { searchQuery } = this.getQueryConfig(query);

    // prepares the query
    const mongoQuery = model.findOne(searchQuery as FilterQuery<TDocument>);

    // a *lean* selector query executes a performance-
    // improved mongo query in that document properties
    // are stripped out and only `_id` is returned.
    if (true === stripDocument) {
      return await mongoQuery.select("_id").lean();
    }

    // executes the [non-lean] query
    return await mongoQuery.exec();
  }

  /**
   * This method updates *exactly one document* in a collection. The
   * query is build using {@link getQueryConfig} and can thereby use
   * any columns of the document.
   * <br /><br />
   *
   * @access public
   * @async
   * @param   {Queryable<TDocument>}             query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {TModel}      model   The model *class instance* used for the resulting document.
   * @param   {Record<string, any>}   data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @param   {Record<string, any>}   ops    The operations that must be run additionally (e.g. `$inc: {}`) (optional).
   * @returns {Promise<TDocument>}
   */
  public async createOrUpdate(
    query: Queryable<TDocument>,
    model: TModel,
    data: Record<string, any>,
    ops: MongoQueryOperations = {},
  ): Promise<TDocument> {
    // wrap pagination+query to be mongo-compatible
    const { searchQuery } = this.getQueryConfig(query);

    // destructures query **fields** for the update query (no-sort, etc.)
    const { sort, order, pageNumber, pageSize, ...updateQuery } = searchQuery;

    // adds *operations* to updated data, only for custom queries
    // this covers the use of: "$inc", "$dec", "$set", etc.
    // CAUTION this method automatically *wraps* `data` in a `$set` operation.
    const operations: Record<string, any> = {
      ...data,
      ...ops,
    };

    // execute query and return a single document
    // note that this method uses the `upsert` option
    // to execute an INSERT for inexisting document
    return await model
      .findOneAndUpdate(updateQuery as any, operations, {
        upsert: true,
        returnOriginal: false,
      })
      .exec();
  }

  /**
   * Method to update a batch of documents in one collection. The
   * query built here uses a document's `_id` field value and
   * updates *all* fields present in the `TDocument` generic class.
   * <br /><br />
   * Note that the {@link Documentable} concern is used as a
   * requirement of `TDocument` to make sure that the `_id` field
   * is indeed present and populated.
   * <br /><br />
   * Note also that this method automatically sets the value of
   * a field `updatedAt` to the time of execution of the query.
   *
   * @todo Currently the `$set` parameters use `new Date()`, probably a mongo/mongoose routine for "now" is more adequate.
   * @access public
   * @async
   * @param   {TModel}        model           The model *class instance* used for the resulting document.
   * @param   {TDocument[]}   documents       The list of *matching documents* that must be updated with this batch operation.
   * @returns {Promise<number>}   The number of documents **affected** by the update queries.
   */
  public async updateBatch(
    model: TModel,
    documents: TDocument[],
  ): Promise<number> {
    // creates a bulk operation handler
    const bulk: any = model.collection.initializeUnorderedBulkOp();

    // each document is updated in one query
    // all queries are batched together with bulk handler
    // note that an **upsert** is used for new documents
    documents.map((document: TDocument) =>
      bulk
        .find(document.toQuery)
        .upsert()
        .update({
          $set: {
            ...document,
            updatedAt: new Date(),
          },
        }),
    );

    // execute the bulk operation
    let result: any;
    if (!(result = await bulk.execute())) {
      return 0;
    }

    // sum number of inserted, updated and upserted
    return (
      ("nInserted" in result ? result.nInserted : 0) +
      ("nModified" in result ? result.nModified : 0) +
      ("nUpserted" in result ? result.nUpserted : 0)
    );
  }

  /**
   * Create a generic *union search query* that is compatible with Mongo. The
   * returned {@link PaginatedResultDto} contains a `data` field and a
   * `pagination` field to permit multiple queries to be sequenced.
   * <br /><br />
   * This method also *executes* the search query using the Mongo service
   * connected to handle {@param model}.
   * <br /><br />
   * This method is different {@link find} in that it permits to execute a
   * **union query**, effectively *combining multiple collections* in the
   * result set.
   * <br /><br />
   * Note that this method takes *three generics* that **must**
   * extend the {@link Documentable} class and **must** also
   * contain a `collectionName`, e.g. in {@link Account}. Only
   * the *first* of these generics is *obligatory*, others can
   * be used when handling more complex union queries and by default
   * may be omitted.
   *
   * @access public
   * @async
   * @param   {Queryable<TDocument>}   query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {TModel}        model           The model *class instance* used for the resulting document.
   * @param   {Map<string, Queryable<T2ndDocument|T3rdDocument|T4thDocument>>}  unionWith  (Optional) This parameter should contain a map of {@link Queryable} objects - defaults to empty union specification (no union).
   * @param   {MongoRoutineCount[]}    metadata   (Optional) This parameter should contain one or more `$count` pipeline stage(s) - defaults to empty metadata.
   * @returns {MongoQueryPipeline}    The resulting *aggregate search query* specification that is compatible with *Mongo aggregate queries*.
   */
  public async union<
    T2ndDocument extends Documentable & { collectionName: string },
    T3rdDocument extends Documentable & { collectionName: string } = any,
    T4thDocument extends Documentable & { collectionName: string } = any,
  >(
    query: Queryable<TDocument>,
    model: TModel,
    unionWith: Map<
      string,
      Queryable<T2ndDocument | T3rdDocument | T4thDocument>
    >,
    metadata?: MongoRoutineCount[],
  ): Promise<
    PaginatedResultDTO<TDocument & T2ndDocument & T3rdDocument & T4thDocument>
  > {
    // wrap pagination+query to be mongo-compatible
    const { queryCursor } = this.getQueryConfig(query);

    // prepare an *aggregate* query compatible with
    // the *mongoose* `Model`'s `aggregate()` method
    // this will always contain a `$unionWith` stage
    const aggregateQuery = this.getAggregateFindQuery(
      query,
      unionWith,
      metadata, // metadata
    );

    // execute Mongo query
    // @todo this *aggregate* query should be moved to a new method `findWithTotal`.
    // @todo fallback to `mongoose` Model.find method instead for performance.
    const [{ data, metadata: resultMeta }] = await model
      .aggregate([...aggregateQuery] as any)
      .exec();

    // build pagination details for PaginatedResultDTO
    const pagination = {
      pageNumber: queryCursor.page + 1,
      pageSize: queryCursor.limit,
      total: resultMeta.length > 0 ? resultMeta[0].total : 0,
    };

    // internal type used to return a *combination* of
    // multiple *document types*, i.e. multiple mongo documents.
    type TResultDocument = TDocument &
      T2ndDocument &
      T3rdDocument &
      T4thDocument;

    // returns wrapped entity page
    return PaginatedResultDTO.create<TResultDocument>(data, pagination);
  }

  /**
   * Format the search query parameters to a Mongo compatible
   * documents search query. The resulting object can be used
   * to configure an executable Mongo aggregation or query.
   * <br /><br/>
   * Note that pagination parameters can be omitted with the
   * following defaults being used: `sort="_id"`, `order="asc"`,
   * `pageNumber=1`, `pageSize=20`.
   * <br /><br />
   * Note that the generic `TQueryDocument` should usually be
   * an object that extends {@link Documentable}, this is the
   * case for example with {@link AccountDocument} and it will
   * also contain a `collectionName` as defined in {@link Account}.
   *
   * @access protected
   * @param   {Queryable<TDocument>}   query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {SearchQuery}   The configured {@link SearchQuery} with pagination parameters and sanitized Mongo query.
   */
  protected getQueryConfig<TQueryDocument extends Documentable>(
    query: Queryable<TQueryDocument>,
  ): SearchQuery {
    // destructures query parameters
    const { sort, order, pageNumber, pageSize } = query;

    // wrap search query and validate/fix query fields
    const { searchQuery } = (({ document }) => ({
      searchQuery: this.sanitizeSearchQuery({ ...document }), // destructuring
    }))(query);

    // defaults to sortField being "_id"
    // defaults to ASC sorting direction
    const sortField = sort && sort.length ? sort : "_id";
    const direction = order && order === "desc" ? -1 : 1;

    // mongo uses *indexed* page numbers
    const page = pageNumber ? pageNumber - 1 : 0;

    // defaults to 20 items per page
    const limit = pageSize ? +pageSize : 20;
    const skip = page && limit ? page * limit : 0;

    return {
      queryCursor: { page, limit, skip } as MongoQueryCursor,
      querySorter: { [sortField]: direction },
      searchQuery: searchQuery,
    };
  }

  /**
   * Format the search query parameters to a Mongo compatible
   * aggregate search query. The resulting object can be used
   * to configure an executable Mongo aggregation or query.
   * <br /><br/>
   * Note that pagination parameters can be omitted with the
   * following defaults being used: `sort="_id"`, `order="asc"`,
   * `pageNumber=1`, `pageSize=20`.
   * <br /><br />
   * Note that this method takes *three generics* that **must**
   * extend the {@link Documentable} class and **must** also
   * contain a `collectionName`, e.g. in {@link Account}. Only
   * the *first* of these generics is *obligatory*, others can
   * be used when handling more complex union queries.
   *
   * @access protected
   * @param   {Queryable<TDocument>}   query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {Map<string, Queryable<T2ndDocument|T3rdDocument|T4thDocument>>}  unionWith  (Optional) This parameter should contain a map of {@link Queryable} objects - defaults to empty union specification (no union).
   * @param   {MongoRoutineCount[]}    metadata   (Optional) This parameter should contain one or more `$count` pipeline stage(s) - defaults to empty metadata.
   * @returns {MongoQueryPipeline}    The resulting *aggregate search query* specification that is compatible with *Mongo aggregate queries*.
   */
  protected getAggregateFindQuery<
    T2ndDocument extends Documentable & { collectionName: string },
    T3rdDocument extends Documentable & { collectionName: string } = any,
    T4thDocument extends Documentable & { collectionName: string } = any,
  >(
    query: Queryable<TDocument>,
    unionWith?: Map<
      string,
      Queryable<T2ndDocument | T3rdDocument | T4thDocument>
    >,
    metadata?: MongoRoutineCount[],
  ): MongoQueryPipeline {
    // wrap pagination+query to be mongo-compatible
    const { queryCursor, querySorter, searchQuery } =
      this.getQueryConfig(query);

    // prepares the returned pipeline stages
    const stages: MongoQueryPipeline = [];

    // prepare the `$facet` routines for pagination
    // and potential metadata about the result set
    let facetPipelineStage: MongoPipelineFacet = {
      $facet: {
        data: [
          { $skip: queryCursor.skip },
          { $limit: queryCursor.limit },
          { $sort: querySorter },
        ],
      },
    };

    // currently *only supports* the `$count` operator
    if (metadata !== undefined && metadata.length) {
      facetPipelineStage = {
        $facet: {
          ...facetPipelineStage.$facet,
          metadata: metadata,
        },
      };
    }

    // additional **unions** can be specified in `unionWith`
    (unionWith ?? []).forEach((union, group) => {
      // wrap pagination+query to be mongo-compatible
      const {
        searchQuery: unionSearchQuery,
        queryCursor: unionQueryCursor,
        querySorter: unionQuerySorter,
      } = this.getQueryConfig(union);

      // appends the union query specification
      stages.push({
        $unionWith: {
          coll: union.document.collectionName,
          pipeline: [
            {
              $match: unionSearchQuery as FilterQuery<typeof union.document>,
            },
            {
              $facet: {
                data: [
                  { $skip: unionQueryCursor.skip },
                  { $limit: unionQueryCursor.limit },
                  { $sort: unionQuerySorter },
                ],
                // @todo does not support `metadata[]` for union
              },
            },
            {
              $group: { _id: group },
            },
          ],
        },
      });
    });

    // adds a `$match`- and `$facet` pipeline stages
    // note that this uses `upshift` to prepend the
    // $match and $facet stages to the pipeline
    stages.unshift(facetPipelineStage);
    stages.unshift({ $match: searchQuery as FilterQuery<TDocument> });

    // returns a pipeline with currently only 2 possible stages
    return stages;
  }

  /**
   * This method performs an aggregate query and returns a mongo
   * aggregate result which consists of a collection of the provided
   * model's items.
   * <br /><br />
   * This method also *executes* the search query using the Mongo service
   * connected to handle {@param model}.
   *
   * @access public
   * @param {PipelineStage[]} query
   * @param {TModel} model
   * @returns {Aggregate<TModel[]>}
   */
  public async aggregate(
    query: PipelineStage[],
    model: TModel,
  ): Promise<Aggregate<TModel[]>> {
    return await model.aggregate(query).exec();
  }

  /**
   * This method sanitizes a search query and returns a mongo
   * compatible query that can be executed and uses the correct
   * types for its conditions (and field values).
   * <br /><br />
   * This method can be used whenever data has been *read* from
   * Mongo and still has *string* typed values. Note that this
   * routine is not compatible with deep objects and may corrupt
   * typings of complex class instances.
   *
   * @access protected
   * @param   {UnsafeQueryConditions}   searchQuery   An object that contains *unsafe* (non-sanitized) query conditions.
   * @returns {MongoQueryCondition} The sanitized search query, can be passed in mongoose `$match`.
   */
  protected sanitizeSearchQuery(
    searchQuery: UnsafeQueryConditions,
  ): MongoQueryConditions {
    // prepare result bundle
    const result = {} as MongoQueryConditions;

    // each search query field gets type-cast
    for (const field in searchQuery) {
      // queries may not use undefined
      if ("collectionName" === field || undefined === searchQuery[field]) {
        continue;
      }

      result[field] = this.typecastField(searchQuery[field]);
    }

    // return the mongo compatible conditions
    return result;
  }

  /**
   * This method type-casts individual query values to *primitive*
   * types and creates routines for specific primitives like `number`
   * or `array`.
   * <br /><br />
   * Following rules apply:
   *  1. If it's a **boolean** value ('true', 'false') convert it to boolean.
   *  2. If it's a **number**, returns `{ $in: [+value, value] }` // both string and numeric values.
   *  3. If it's an **array**, loop through all items and check each one with step 1, 2 and 4
   *  4. If it's not any of the above types, it's a **string**. Returns original value.
   * <br /><br />
   * Note that objects or complex class instances cannot currently
   * be type-cast using this method.
   *
   * @access protected
   * @param   {UnknownFieldValue}   value   A field value that needs to be type-casted to a primitive or using a routine.
   * @returns {MongoQueryConditionValue}    A type-cast representation of the passed value or a Mongo routine configuration.
   */
  protected typecastField(value: UnknownFieldValue): MongoQueryConditionValue {
    // (1) boolean
    if (value === "true" || value === "false") {
      return (value === "true") as boolean;
    }
    // (2) number
    else if (!Array.isArray(value) && !isNaN(value)) {
      return { $in: [+value, value] } as MongoRoutineIn;
    }
    // (3) array
    else if (Array.isArray(value)) {
      // recursive call to typecast values inside the
      // array to the most primitive types. After the
      // values have been processed, the array contains
      // *sanitized* values that are used in a routine.
      const newValues = value.map((item) => {
        // possible typecast to primitive
        const sanitizedItem = this.typecastField(item);

        // if the typecast results in a known routine
        // then the routine values should be returned
        if (Object.keys(sanitizedItem).includes("$in")) {
          // cast the internal routine values
          const val: number[] | string[] = (sanitizedItem as MongoRoutineIn)[
            "$in"
          ];
          return !(val as any[]).length
            ? []
            : typeof val[0] === "string"
            ? (val as string[])
            : (val as number[]);
        }

        return sanitizedItem;
      });

      // the condition value is a $in routine
      return { $in: newValues.flat() } as MongoRoutineIn;
    }

    // otherwise return without changes
    return value;
  }
}
