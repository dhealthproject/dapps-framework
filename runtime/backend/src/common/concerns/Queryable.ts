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
import { FilterQuery } from "mongoose";

// internal dependencies
import { Pageable } from "./Pageable";
import { Sortable } from "./Sortable";
import { Documentable } from "./Documentable";

/**
 * @interface QueryParameters
 * @description This interface configures simple database queries
 * that can be *paginated* and *sorted*. A query may use the `id`
 * field to match individual documents.
 *
 * @see Queryable
 * @since @v0.2.0
 */
export interface QueryParameters extends Pageable, Sortable {
  pageNumber: number;
  pageSize: number;
  sort: string;
  order: string;
}

/**
 * @interface Queryable
 * @description This concern requires the presence of fields that
 * consist in delivering *queryable* information.
 *
 * @since v0.2.0
 */
export class Queryable<TDocument extends Documentable>
  implements QueryParameters {
  /**
   * The document entry used as a filter. This property can be used
   * to query documents by equality of fields.
   * <br /><br />
   * Note that queries with more complex *operators* must use the
   * {@link filterQuery} property instead and leave this one blank.
   * <br /><br />
   * @example Setting a `document`
   * ```js
   *  document: {} as Document
   *  document: { field: value } as Document
   * ```
   *
   * @access public
   * @var {TDocument}
   */
  public document?: TDocument;

  /**
   * Determines the page number that is being requested. This will
   * also define the offset of results that are returned.
   * <br /><br />
   * @example Setting a `pageNumber`
   * ```js
   *  pageNumber: 3
   * ```
   *
   * @access public
   * @see {Pageable}
   * @var {number}
   */
  public pageNumber: number;

  /**
   * Determines the page size that is being requested. This will
   * also define the maximum number of results that are returned.
   * <br /><br />
   * @example Setting a `document`
   * ```js
   *  pageSize: 100
   * ```
   *
   * @access public
   * @see {Pageable}
   * @var {number}
   */
  public pageSize: number;

  /**
   * Determines the sort field that is being requested. This will
   * define the field used to sort results that are returned.
   * <br /><br />
   * @example Setting a `sort` field name
   * ```js
   *  sort: "address"
   * ```
   *
   * @access public
   * @see {Sortable}
   * @var {string}
   */
  public sort: string;

  /**
   * Determines the order direction that is being requested. This will
   * define the order direction of results that are returned.
   * <br /><br />
   * Possible values are:
   * - `"asc"`: Sorts the results in *ascending* order, i.e. "first in, first out".
   * - `"desc"`: Sorts the results in *descendeing* order, i.e. "last in, first out".
   * <br /><br />
   * @example Setting a `order` direction
   * ```js
   *  order: "asc"
   *  order: "desc"
   * ```
   *
   * @access public
   * @see {Sortable}
   * @var {string}
   */
  public order: string;

  /**
   * The custom filter query that must be used. This property can
   * be used to filter results using enhanced mongodb operators,
   * including: `$ne`, `$in`, `$gte`, `$lte`, etc.
   * <br /><br />
   * Note that queries that use only the *equality* operator can
   * use the {@link document} property as well which removes the
   * need to specify the operators (always uses equality).
   * <br /><br />
   * @example Setting a `filterQuery`
   * ```js
   *  filterQuery: { 
   *    $ne: { field: value },
   *    $gte: { otherField: otherValue }
   *  } as FilterQuery<Document>
   * ```
   *
   * @access public
   * @var {FilterQuery<TDocument>}
   */
  public filterQuery?: FilterQuery<TDocument>;

  /**
   * Copy constructor for pageable *generic* queries. The query
   * parameters that are optionally passed to this method are
   * used to mimic a copy construction logic and set default
   * parameters for the query given any of these is undefined.
   * <br /><br />
   * Destructured query parameters include:
   * - `pageNumber`: The page number of the query (defaults to `1`).
   * - `pageSize`: The number of entities/documents in one page (defaults to `20`).
   * - `sort`: The field used for sorting (defaults to `"_id"`).
   * - `order`: The sorting direction, must be one of `"asc"` and `"desc"` (defaults to `"asc"`)
   *
   * @param   {TDocument|undefined}           document          The *document* instance (defaults to `undefined`).
   * @param   {QueryParameters|undefined}     queryParameters   The query parameters including as defined in {@link QueryParameters}.
   */
  public constructor(
    document?: TDocument,
    {pageNumber, pageSize, sort, order}: QueryParameters = {
      pageNumber: 1,
      pageSize: 20,
      sort: "_id",
      order: "asc"
    },
    filterQuery?: FilterQuery<TDocument>,
  ) {
    // note that the `document` parameter can take `undefined`,
    // the document is then ignored and not used in the query.
    this.document = document;
    this.filterQuery = filterQuery;

    // mapping default field values if necessary
    this.pageNumber = undefined === pageNumber ? 1 : pageNumber;
    this.pageSize = undefined === pageSize ? 20 : pageSize;
    this.sort = undefined === sort ? "_id" : sort;
    this.order = undefined === order ? "asc" : order;
  }

  /**
   * This method implements the getter logic for the current
   * queryable document. Typically, the {@link document} property
   * contains an *individual document* with primary keys set.
   *
   * @returns {TDocument}
   */
  public getDocument(): TDocument {
    return this.document;
  }

  /**
   * This method implements the setter logic for the current
   * queryable document.
   *
   * @param   {TDocument}   document 
   * @returns {Queryable<TDocument>}
   */
  public setDocument(document: TDocument): Queryable<TDocument> {
    this.document = document;
    return this;
  }

  /**
   * This method must return an object that can be used as the value
   * for the mongodb `find` operations to represent one document.
   * Typically, this method returns an object where keys are the
   * *primary key(s)* of the entity and values are those of the
   * document represented by the current instance.
   *
   * @returns {Record<string, any>}    The individual document data that is used in a query.
   */
  public forDocument(): Record<string, any> {
    return this.document.toQuery;
  }
}
