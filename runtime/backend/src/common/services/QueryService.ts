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
import { Model, FilterQuery } from "mongoose";

// internal dependencies
import { Documentable } from "../concerns/Documentable";
import { Queryable } from "../concerns/Queryable";
import { PaginatedResultDTO } from "../models/PaginatedResultDTO";

/// block to-refactor
// the following types permit a "no-implicit-any" ruling on the repository
// but will be refactored to further extend the *abstraction layer* around
// queries and make it compatible with 1. Mongo Queries and 2. HTTP Queries
// such that the query service can be used as a middleware to build queries
export type UnknownFieldValue = boolean | number | string | any[] | null | any;

export type UnsafeQueryConditions = {
  [key: string]: UnknownFieldValue;
};

export type MongoQueryCursor = {
  page: number;
  limit: number;
  skip: number;
};

export type MongoQueryRoutine = { $in: number[] | string[] };
export type MongoQueryConditionValue =
  | boolean
  | number
  | string
  | any[]
  | MongoQueryRoutine;

export type MongoQueryConditions = {
  [key: string]: MongoQueryConditionValue;
};
/// end-block to-refactor

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
 *
 * @todo add example in class documentation
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
   * @param   {Queryable<TDocument>}  query
   * @param   {TModel}                model
   * @returns {Promise<number>}   The number of matching documents.
   */
  async count(query: Queryable<TDocument>, model: TModel): Promise<number> {
    return await model.count(query);
  }

  /**
   * Method to query the *existence* of a document in the
   * collection mapped to {@link TModel}.
   * <br /><br />
   * This executes a *lean* mongoose query such that the
   * properties of the returned document are *reduced* to
   * only the `"_id"` field.
   *
   * @param   {Queryable<TDocument>}  query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {TModel}  model     The model *class instance* used for matching documents.
   * @returns {Promise<boolean>}  Whether a document exists which validates the passed query.
   */
  async exists(query: Queryable<TDocument>, model: TModel): Promise<boolean> {
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
  public async find(
    query: Queryable<TDocument>,
    model: TModel,
  ): Promise<PaginatedResultDTO<TDocument>> {
    // wrap pagination+query to be mongo-compatible
    const { queryCursor, querySorter, searchQuery } =
      this.getQueryConfig(query);

    // execute Mongo query
    // @todo this *aggregate* query should be moved to a new method `findWithTotal`.
    // @todo fallback to `mongoose` Model.find method instead for performance.
    const [{ data, metadata }] = await model
      .aggregate([
        { $match: searchQuery as FilterQuery<TDocument> },
        {
          $facet: {
            data: [
              { $skip: queryCursor.skip },
              { $limit: queryCursor.limit },
              { $sort: querySorter },
            ],
            metadata: [{ $count: "total" }],
          },
        },
      ])
      .exec();

    // build pagination details
    const pagination = {
      pageNumber: queryCursor.page + 1,
      pageSize: queryCursor.limit,
      total: metadata.length > 0 ? metadata[0].total : 0,
    };

    // returns wrapped entity page
    // @todo move to static factory
    const result: PaginatedResultDTO<TDocument> =
      new PaginatedResultDTO<TDocument>();
    result.data = data;
    result.pagination = pagination;
    return result;
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
    ops: Record<string, any> = {},
  ): Promise<TDocument> {
    // wrap pagination+query to be mongo-compatible
    const { searchQuery } = this.getQueryConfig(query);

    // destructures query **fields** for the update query (no-sort, etc.)
    const { sort, order, pageNumber, pageSize, ...updateQuery } = searchQuery;

    // adds *operations* to updated data, only for custom queries
    // this covers the use of: "$inc", "$dec", "$set", etc.
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
   * @async
   * @param   {TModel}    model
   * @param   {TDocument[]}         documents
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
   * Format the search query parameters to a Mongo compatible
   * documents search query. The resulting object can be used
   * to configure an executable Mongo aggregation or query.
   * <br /><br/>
   * Note that pagination parameters can be omitted with the
   * following defaults being used: `sort="_id"`, `order="asc"`,
   * `pageNumber=1`, `pageSize=20`.
   *
   * @access protected
   * @param   {Queryable<TDocument>}   query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {SearchQuery}   The configured {@link SearchQuery} with pagination parameters and sanitized Mongo query.
   */
  protected getQueryConfig(query: Queryable<TDocument>): SearchQuery {
    // destructures query parameters
    const { sort, order, pageNumber, pageSize } = query;

    // wrap search query and validate/fix query fields
    const { searchQuery } = (({
      sort,
      order,
      pageNumber,
      pageSize,
      document,
    }) => ({
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
      if (undefined === searchQuery[field]) {
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
    else if (!isNaN(value)) {
      return { $in: [+value, value] } as MongoQueryRoutine;
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
          const val: number[] | string[] = (sanitizedItem as MongoQueryRoutine)[
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
      return { $in: newValues.flat() } as MongoQueryRoutine;
    }

    // otherwise return without changes
    return value;
  }
}
