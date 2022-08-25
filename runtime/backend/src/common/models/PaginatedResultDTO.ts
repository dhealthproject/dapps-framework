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
import { ApiProperty } from "@nestjs/swagger";

// internal dependencies
import { Transferable } from "../concerns/Transferable";
import { Countable } from "../concerns/Countable";
import { Pageable } from "../concerns/Pageable";

/**
 * @class PaginatedResultDTO
 * @description This class represents a **paginated** result
 * object around the `TData` template. Data is returned in a
 * field named `data` as an array of `TData`.
 * <br /><br />
 * This class shall be used to **respond** with paginated
 * results from an endpoint (route).
 *
 * @since v0.1.0
 */
export class PaginatedResultDTO<TData> {
  /**
   * Contains the results returned by the query in an array of
   * template type `TData`.
   * <br /><br />
   * An array of documents will always be of maximum size as it
   * is specified in the {@link pagination} property.
   *
   * @access public
   * @var {TData[]}
   */
  @ApiProperty()
  public data: TData[];

  /**
   * Contains the pagination properties such as `pageSize`,
   * `pageNumber` and `total`.
   *
   * @access public
   * @var {Pageable & Countable}
   */
  @ApiProperty()
  public pagination: Pageable & Countable;

  /**
   *
   */
  public static createForTransport<
    TTransport,
    TDocument extends Transferable<TTransport>,
  >(
    data: TDocument[],
    pagination: Pageable & Countable,
  ): PaginatedResultDTO<TTransport> {
    const result = new PaginatedResultDTO<TTransport>();
    result.data = data.map((d: TDocument) => d.toDTO);
    result.pagination = pagination;
    return result;
  }

  /**
   *
   */
  public constructor(
    data: TData[] = [],
    pagination: Pageable & Countable = {
      pageNumber: 1,
      pageSize: 100,
      total: 0,
    },
  ) {
    this.data = data;
    this.pagination = pagination;
  }

  /**
   *
   */
  public isLastPage(): boolean {
    return (
      this.data.length < this.pagination.pageSize ||
      this.pagination.pageNumber * this.pagination.pageSize >=
        (this.pagination.total ?? 0)
    );
  }
}
