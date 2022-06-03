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
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

// internal dependencies
import { PagePaginatedQueryDto, PaginatedResutDto } from 'src/common/models';

/**
 * @class QueriesService
 * @description Service class that contains methods to validate, process and validify
 * request queries.
 *
 * @since v0.1.0
 */
@Injectable()
export class QueriesService {
  /**
   * Query database for an array of instances of a model based on query.
   * This is a generic method intended to be used with all types of data.
   *
   * @async
   * @param   {PagePaginatedQueryDto} query
   * @param   {any} model
   * @returns {Promise<PaginatedResutDto<any>>}
   */
  async find(
    query: PagePaginatedQueryDto,
    model: Model<any>,
  ): Promise<PaginatedResutDto<any>> {
    const [pagQuery, findQuery] = this.getPaginationParams(query);
    const sort = {};
    sort[pagQuery.sortField] = pagQuery.orderSign == '-' ? -1 : 1;
    const [{ data, metadata }] = await model
      .aggregate([
        { $match: findQuery },
        {
          $facet: {
            data: [
              { $skip: pagQuery.skip },
              { $limit: pagQuery.limit },
              { $sort: sort },
            ],
            metadata: [{ $count: 'total' }],
          },
        },
      ])
      .exec();
    const pagination = {
      pageNumber: pagQuery.page + 1,
      pageSize: pagQuery.limit,
      total: metadata.length > 0 ? metadata[0].total : 0,
    };
    return { data, pagination };
  }

  /**
   * Extract the pagination parameters from a query and returns an object that
   * the database can understands for data querying.
   *
   * @param   {PagePaginatedQueryDto} query
   * @returns {any[]}
   */
  getPaginationParams(query: PagePaginatedQueryDto): any[] {
    const [sort, order, pageNumber, pageSize, findQuery] =
      this.getOriginalPaginationParams(query);
    const sortField = sort ? sort : '_id';
    const orderSign = order && order == 'desc' ? '-' : '';
    const page = pageNumber ? pageNumber - 1 : 0;
    const limit = pageSize ? +pageSize : 20;
    const skip = page && limit ? page * limit : 0;
    return [{ sortField, orderSign, page, limit, skip }, findQuery];
  }

  /**
   * Extract the pagination parameters from a query.
   * These include:
   * ```js
   *  sort, order, pageNumber, pageSize
   * ```
   *
   * @param   {PagePaginatedQueryDto} query
   * @returns {any[]}
   */
  private getOriginalPaginationParams(query: PagePaginatedQueryDto): any[] {
    return (({ sort, order, pageNumber, pageSize, ...o }) => [
      sort,
      order,
      pageNumber,
      pageSize,
      this.validifyFindQuery(o),
    ])(query);
  }

  /**
   * Takes an Mongo query object and validifies it so that Mongo understands it.
   *
   * @param   {object} findQuery
   * @returns {object} the proccessed findQuery
   */
  validifyFindQuery(findQuery: object): object {
    const result = {};
    Object.keys(findQuery).map((key) => {
      const value = findQuery[key];
      result[key] = this.validifyQueryValue(value);
    });
    return result;
  }

  /**
   * Validify a query value to one that Mongo understands it.
   *
   * The rules are:
   *  1. If it's a **boolean** value ('true', 'false') convert it to boolean.
   *  2. If it's a **number**, returns `{ $in: [+value, value] }` // both string and numeric values.
   *  3. If it's an **array**, loop through all items and check each one with step 1, 2 and 4
   *  4. If it's not any of the above types, it's a **string**. Returns original value.
   *
   * @param   {any} value
   * @returns {any} validified value
   */
  validifyQueryValue(value: any): any {
    if (value === 'true' || value === 'false') {
      return value === 'true';
    } else if (!isNaN(value)) {
      return { $in: [+value, value] };
    } else if (Array.isArray(value)) {
      const newValue = value.map((item) => {
        const validifiedItem = this.validifyQueryValue(item);
        if (validifiedItem['$in']) return validifiedItem['$in'];
        return validifiedItem;
      });
      return { $in: newValue.flat() };
    } else {
      return value;
    }
  }
}
