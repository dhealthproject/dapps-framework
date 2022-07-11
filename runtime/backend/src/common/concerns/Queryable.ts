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
   * The **document** identifier. Any document that is queryable,
   * typically has an *identifier*, a.k.a. a **primary key value**.
   *
   * @access public
   * @var {string}
   */
  // public id?: string;

  /**
   * 
   */
  public document?: TDocument;

  /**
   * Page number query.
   * Determine which page number the result should be returned from.
   *
   * E.g.
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
   * Page size query.
   * Determine which page size the result should be returned as.
   *
   * E.g.
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
   * Sort query.
   * Determine which field of the result should be sorted by.
   *
   * E.g.
   * ```js
   *  sort: 'address'
   * ```
   *
   * @access public
   * @see {Sortable}
   * @var {string}
   */
  public sort: string;

  /**
   * Order query.
   * Determine which direction the result should be sorted by.
   *
   * Values are `asc` and `desc`.
   *
   * E.g.
   * ```js
   *  order: 'asc'
   * ```
   *
   * @access public
   * @see {Sortable}
   * @var {string}
   */
  public order: string;

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
  ) {
    // note that the `document` parameter can take `undefined`,
    // the document is then ignored and not used in the query.
    this.document = document;

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
