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
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

// internal dependencies
import { State, StateDocument, StateQuery } from "../models/StateSchema";
import type { StateData } from "../models/StateData";

/**
 * @class StateService
 * @description The main service for the state module.
 * Responsible for querying and saving states of the application.
 *
 * @todo Method `updateOne()` should not take a DTO in parameters, but a StateDocument or StateQuery instead.
 * @since v0.1.0
 */
@Injectable()
export class StateService {
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
   * @param   {StateQuery} query
   * @returns {Promise<State>}
   */
  async findOne(query: StateQuery): Promise<State> {
    return this.model.findOne(query).exec();
  }

  /**
   * Update a {@link State} instance in database.
   * If no instance exists, insert object to database as a new instance.
   *
   * @todo The brackets with `name` should be a **query** from parameters
   * @async
   * @param   {StateQuery} stateQuery
   * @returns {Promise<State>}
   */
  async updateOne(
    stateQuery: StateQuery,
    stateData: StateData,
  ): Promise<State> {
    return this.model
      .findOneAndUpdate({ name: stateQuery.name }, stateData, {
        upsert: true,
      })
      .exec();
  }
}
