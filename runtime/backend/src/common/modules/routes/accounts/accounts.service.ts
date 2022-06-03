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
import { Model } from 'mongoose';

import { BulkWriteResult, UnorderedBulkOperation } from 'mongodb';

// internal dependencies
import {
  Account,
  AccountDocument,
  AccountDTO,
  AccountQueryDTO,
  PaginatedResutDto,
} from '../../../../common/models';
import { QueriesService } from '../../services/queries/queries.service';

/**
 * @class AccountsService
 * @description The main service of the Accounts module.
 *
 * @since v0.1.0
 */
@Injectable()
export class AccountsService {
  /**
   * The constructor of the service.
   *
   * @constructor
   * @param {Model<AccountDocument>} model
   * @param {QueriesService} queriesService
   */
  constructor(
    @InjectModel(Account.name) private readonly model: Model<AccountDocument>,
    private readonly queriesService: QueriesService,
  ) {}

  /**
   * Method to query accounts based on query and returns as paginated result.
   *
   * @async
   * @param   {AccountQueryDTO} query
   * @returns {Promise<PaginatedResutDto<Account>>}
   */
  async find(query: AccountQueryDTO): Promise<PaginatedResutDto<Account>> {
    return this.queriesService.find(query, this.model);
  }

  /**
   * Method to update a batch of accounts.
   *
   * @async
   * @param   {AccountDTO} createAccountDtos
   * @returns {Promise<Account[]>}
   */
  async updateBatch(createAccountDtos: AccountDTO[]): Promise<BulkWriteResult> {
    const bulk: UnorderedBulkOperation =
      this.model.collection.initializeUnorderedBulkOp();
    createAccountDtos.map((createAccountDto: AccountDTO) => {
      bulk
        .find({ address: createAccountDto.address })
        .upsert()
        .update({
          $set: {
            ...createAccountDto,
            updatedAt: new Date(),
          },
        });
    });
    return bulk.execute();
  }
}
