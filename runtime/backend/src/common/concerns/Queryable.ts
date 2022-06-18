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

/**
 * @interface Queryable
 * @description This concern requires the presence of fields that
 * consist in delivering *queryable* information.
 *
 * @since v0.1.0
 */
export class Queryable implements Pageable, Sortable {
  /**
   * The **document** identifier. Any document that is queryable,
   * typically has an *identifier*, a.k.a. a **primary key value**.
   *
   * @access public
   * @var {string}
   */
  public id?: string;

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
   *
   * @param   {string|undefined}    identifier   The *document* identifier (value of the field "_id").
   * @param   {number|undefined}    pageNumber   The page number of the query (defaults to `1`).
   * @param   {number|undefined}    pageSize     The number of entities/documents in one page (defaults to `20`).
   * @param   {string|undefined}    sort         The field used for sorting (defaults to `"_id"`).
   * @param   {string|undefined}    order        The sorting direction, must be one of `"asc"` and `"desc"` (defaults to `"asc"`)
   */
  public constructor(
    id?: string,
    pageNumber?: number,
    pageSize?: number,
    sort?: string,
    order?: string,
  ) {
    // note that the `id` parameter can take `undefined`,
    // this value is then ignored and not used in the query.
    this.id = id;

    // mapping default field values if necessary
    this.pageNumber = undefined === pageNumber ? 1 : pageNumber;
    this.pageSize = undefined === pageSize ? 20 : pageSize;
    this.sort = undefined === sort ? "_id" : sort;
    this.order = undefined === order ? "asc" : order;
  }
}
