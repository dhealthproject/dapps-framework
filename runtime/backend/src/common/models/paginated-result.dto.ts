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
import { ApiProperty } from '@nestjs/swagger';

/**
 * @class PaginationDto
 * @description A DTO class that represents the paginated part of a response.
 *
 * @since v0.1.0
 */
export class PaginationDto {
  /**
   * The response page number.
   *
   * @var {number}
   */
  pageNumber: number;

  /**
   * The response page size.
   *
   * @var {number}
   */
  pageSize: number;

  /**
   * The total number of results.
   *
   * @var {number}
   */
  total: number;
}

/**
 * @class PaginatedResutDto
 * @description A DTO class that represents the paginated response.
 *
 * @since v0.1.0
 */
export class PaginatedResutDto<TData> {
  /**
   * Response data.
   *
   * @var {TData[]}
   */
  @ApiProperty()
  data: TData[];

  /**
   * Response pagination.
   * Instance of {@link PaginationDto}
   *
   * @var {PaginationDto}
   */
  @ApiProperty()
  pagination: PaginationDto;
}

/**
 * @class PagePaginatedQueryDto
 * @description A DTO class that represents the request's pagination query.
 *
 * @since v0.1.0
 */
export class PagePaginatedQueryDto {
  /**
   * Sort query.
   * Determine which field of the result should be sorted by.
   *
   * E.g.
   * ```js
   *  sort: 'address'
   * ```
   *
   * @var {string}
   */
  sort?: string;

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
   * @var {string}
   */
  order?: string;

  /**
   * Page number query.
   * Determine which page number the result should be returned from.
   *
   * E.g.
   * ```js
   *  pageNumber: 3
   * ```
   *
   * @var {number}
   */
  pageNumber?: number;

  /**
   * Page size query.
   * Determine which page size the result should be returned as.
   *
   * E.g.
   * ```js
   *  pageSize: 100
   * ```
   *
   * @var {number}
   */
  pageSize?: number;
}
