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
import { InjectModel } from '@nestjs/mongoose';
import { Mode } from 'fs';

// internal dependencies
import { Model } from 'mongoose';
import {
  State,
  StateDocument,
  StateDto,
  StateQueryDto,
} from 'src/common/models';

/**
 * @class StatesService
 * @description The main service for the state module.
 * Responsible for querying and saving states of the application.
 *
 * @since v0.1.0
 */
@Injectable()
export class StatesService {
  /**
   * The constructor of this class.
   *
   * @param {Model<StateDocument>} model
   */
  constructor(
    @InjectModel(State.name) private readonly model: Model<StateDocument>,
  ) {}

  /**
   * Find one {@link State} instance in db based on the query object.
   *
   * e.g.
   * ```js
   * findOne({ name: 'some-name' });
   * ```
   *
   * @async
   * @param   {StateQueryDto} query
   * @returns {Promise<State>}
   */
  async findOne(query: StateQueryDto): Promise<State> {
    return this.model.findOne(query).exec();
  }

  /**
   * Update a {@link State} instance in database.
   * If no instance exists, insert object to database as a new instance.
   *
   * @async
   * @param   {StateDto} stateDto
   * @returns {Promise<State>}
   */
  async updateOne(stateDto: StateDto): Promise<State> {
    return this.model
      .findOneAndUpdate({ name: stateDto.name }, stateDto, {
        upsert: true,
      })
      .exec();
  }
}
