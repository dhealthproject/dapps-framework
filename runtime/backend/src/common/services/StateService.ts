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
import { State, StateModel, StateQuery } from "../models/StateSchema";
import type { StateData } from "../models/StateData";
import { QueryService } from "./QueryService";

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
   * @param {StateModel} model
   */
  constructor(
    @InjectModel(State.name) private readonly model: StateModel,
    private readonly queryService: QueryService<State, StateModel>,
  ) {}

  /**
   * Find one `TDocument` instance in the database and use
   * a query based on the {@link Queryable} class.
   * <br /><br />
   * 
   * @access public
   * @async
   * @param   {StateQuery}            query     The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @returns {Promise<State>}  The resulting `states` document.
   */
  async findOne(query: StateQuery): Promise<State> {
    return await this.queryService.findOne(query, this.model);
  }

  /**
   * This method updates *exactly one document* in a collection. The
   * query is build using {@link getQueryConfig} and can thereby use
   * any columns of the document.
   * <br /><br />
   *
   * @async
   * @param   {StateQuery}          query   The query configuration with `sort`, `order`, `pageNumber`, `pageSize`.
   * @param   {StateData}           data    The fields or data that has to be updated (will be added to `$set: {}`).
   * @returns {Promise<State>}  The *updated* `states` document.
   */
  async updateOne(
    query: StateQuery,
    data: StateData,
  ): Promise<State> {
    return await this.queryService.createOrUpdate(
      query,
      this.model,
      { data }, // updates only "data" field
    );
  }
}
