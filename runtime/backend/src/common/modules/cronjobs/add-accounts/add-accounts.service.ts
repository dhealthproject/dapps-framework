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
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import {
  RepositoryFactoryHttp,
  TransactionGroup,
  Page,
  Transaction,
  TransferTransaction,
  Order,
  UInt64,
  TransactionRepository,
  BlockRepository,
} from '@dhealth/sdk';
import { ConfigService } from '@nestjs/config';

// internal dependencies
import { AccountsService } from '../../routes/accounts/accounts.service';
import { AccountDTO } from '../../../../common/models';

/**
 * @class AddAccountsService
 * @description The main service class for {@link AddAccountsModule}.
 * Contains the execution logic for `add-accounts` cronjob.
 *
 * @implements {OnModuleInit}
 * @since v0.1.0
 */
@Injectable()
export class AddAccountsService implements OnModuleInit {
  /**
   * {@link Logger} instance for this class.
   *
   * @access private
   * @readonly
   * @var {@link Logger}
   */
  private readonly logger = new Logger('[Cron] ' + AddAccountsService.name);

  /**
   * The DApp account's public key. Will be retrieved from config service.
   *
   * @access private
   * @var {@link String}
   */
  private dappPublicKey: string;

  /**
   * Map that temporarily stores all recipients of dapp account.
   *
   * @access private
   * @var {@link Map<string, AccountDTO>}
   */
  private recipients: Map<string, AccountDTO>;

  /**
   * The array to temporarily store transaction repositories.
   * This will be used to query transactions from blockchain.
   *
   * @access private
   * @var array of {@link TransactionRepository}
   */
  private transactionRepositories: Array<TransactionRepository> = [];

  /**
   * The array to temporarily store transaction repositories.
   * This will be used to query block information from blockchain.
   *
   * @access private
   * @var array of {@link BlockRepository}
   */
  private blockRepositories: BlockRepository[] = [];

  /**
   * The constructor of this class.
   *
   * @constructor
   * @param {ConfigService}   configService
   * @param {AccountsService} accountsService
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly accountsService: AccountsService,
  ) {}

  /**
   * Method that will run when the module is initialized.
   *
   * The steps are:
   *  1. Get the dapp public key.
   *  2. Initialize transaction and block repositories.
   *  3. Run the cronjob (immediate run).
   *
   * @async
   * @returns {Promise<void>}
   */
  async onModuleInit(): Promise<void> {
    this.dappPublicKey = this.configService.get<string>('dappPublicKey');
    const nodes = this.configService.get<{ url: string }[]>('apiNodes');
    nodes.map((node: { url: string }) => {
      this.transactionRepositories.push(
        new RepositoryFactoryHttp(node.url).createTransactionRepository(),
      );
      this.blockRepositories.push(
        new RepositoryFactoryHttp(node.url).createBlockRepository(),
      );
    });
    await this.handleCron();
  }

  /**
   * The main cron method for this class.
   * Runs every 30 minutes.
   *
   * @async
   * @returns {Promise<void>}
   */
  @Cron('*/30 * * * *')
  async handleCron(): Promise<void> {
    this.logger.log('AddAccountsService starting...');
    this.recipients = new Map<string, AccountDTO>();
    const start = new Date().getTime();
    await this.addAccounts();
    const end = new Date().getTime();
    this.logger.debug('Runtime duration: ' + (end - start) / 1000 + 's');
  }

  /**
   * Method to add all dapp recipient accounts to database.
   *
   * It performs the following:
   *  1. Discover all accounts that receives transaction(s) from dapp account.
   *  2. Get and update the time of the first occured transaction for each account.
   *  3. Save all account's information to database.
   *
   * @async
   * @returns {Promise<void>}
   */
  async addAccounts(): Promise<void> {
    this.logger.log('Discovering accounts...');
    await this.discoverAccounts(this.dappPublicKey);
    this.logger.log('Updating first transaction time...');
    await this.updateFirstTransactionsTime();
    this.logger.log('Updating accounts...');
    await this.saveAccounts(Array.from(this.recipients.values()));
  }

  /**
   * Method to discover all dapp recipient accounts.
   *
   * It performs the following:
   *  1. Query all transactions that has the dapp account as signer.
   *  2. For each transaction get the recipient address.
   *  3. Create an {@link AccountDTO} for each recipient and group them in {@link recipients} map
   *
   * @async
   * @param {string} dappPublicKey
   * @returns {Promise<void>}
   */
  async discoverAccounts(dappPublicKey: string): Promise<void> {
    let pageNumber = 1;
    const pageSize = 100;
    let finished = false;
    let promises: Promise<Page<Transaction>>[] = [];
    const transactionRepositoriesLength = this.transactionRepositories.length;
    do {
      for (let i = 0; i < transactionRepositoriesLength * 50; i++) {
        promises.push(
          this.transactionRepositories[i % transactionRepositoriesLength]
            .search({
              signerPublicKey: dappPublicKey,
              group: TransactionGroup.Confirmed,
              embedded: true,
              order: Order.Asc,
              pageNumber: pageNumber++,
              pageSize,
            })
            .toPromise(),
        );
      }
      finished = await this.handleRequests(promises);
      this.logger.debug(`Processing transaction page: ${pageNumber}...`);
      promises = [];
    } while (!finished);
  }

  /**
   * Method to handle transaction query requests.
   * Processes them asynchronously using {@link Promise.all()}.
   *
   * @async
   * @param   {Promise<Page<Transaction>>} promises
   * @returns {Promise<boolean>} if any page is last page.
   */
  async handleRequests(
    promises: Promise<Page<Transaction>>[],
  ): Promise<boolean> {
    const results = await Promise.all(promises).catch((err: Error) =>
      this.logger.error(err),
    );
    if (!results) return true;
    for (const result of results) {
      const transactions = result.data;
      transactions.forEach((transaction: Transaction) => {
        this.handleTransaction(transaction);
      });
      if (result.isLastPage) return true;
    }
    return false;
  }

  /**
   * Method to handle a queried transaction.
   *
   * It performs the following:
   *
   *  1. If transaction is of type {@link Transaction}:
   *
   *      1.1. If recipient address exists in map: increment transactionsCount
   *
   *      1.2. If recipient address doesn't exist in map: create a new {@link AccountDTO} and add to map.
   *
   * @param   {Transaction}  transaction
   * @returns {void}
   */
  handleTransaction(transaction: Transaction): void {
    if (
      transaction instanceof TransferTransaction &&
      transaction.recipientAddress
    ) {
      const address = transaction.recipientAddress.plain();
      const recipient = this.recipients.get(address);
      if (recipient) {
        recipient.transactionsCount++;
        return;
      }
      const accountDto = this.createAccountDTO(transaction);
      this.recipients.set(transaction.recipientAddress.plain(), accountDto);
    }
  }

  /**
   * Method to create a new AccountDTO for the purpose of this cronjob.
   *
   * @param   {TransferTransaction} transaction
   * @returns {AccountDTO}
   */
  createAccountDTO(transaction: TransferTransaction): AccountDTO {
    return {
      address: transaction.recipientAddress.plain(),
      transactionsCount: 1,
      firstTransactionAtBlock: transaction.transactionInfo.height.compact(),
    };
  }

  /**
   * Method to update all first-transactions time.
   * Since there are many recipients, each time query request will be
   * added to an array and processed asynchrnously using {@link Promise.all()}.
   *
   * @async
   * @returns {Promise<void>}
   */
  async updateFirstTransactionsTime(): Promise<void> {
    let nodeCursor = 0;
    let count = 0;
    let timestampRequests = [];
    for (const key of this.recipients.keys()) {
      const height = this.recipients.get(key).firstTransactionAtBlock;
      timestampRequests.push(this.updateTime(key, height, nodeCursor++));
      count++;
      if (nodeCursor === this.blockRepositories.length) nodeCursor = 0;
      if (
        count === this.recipients.size ||
        count === this.blockRepositories.length * 30
      ) {
        await Promise.all(timestampRequests);
        timestampRequests = [];
        count = 0;
      }
    }
  }

  /**
   * Method to update a first-transaction time.
   *
   * @async
   * @param {string} key
   * @param {number} height
   * @param {number} nodeCursor
   * @returns {Promise<void>}
   */
  async updateTime(
    key: string,
    height: number,
    nodeCursor: number,
  ): Promise<void> {
    const timestamp = await this.getBlockTimestamp(height, nodeCursor);
    this.recipients.get(key).firstTransactionAt = new Date(timestamp);
  }

  /**
   * Method to save recipient accounts to database.
   *
   * @async
   * @param   {AccountDTO[]} createAccountDtos
   * @returns {Promise<void>}
   */
  async saveAccounts(createAccountDtos: AccountDTO[]): Promise<void> {
    await this.accountsService.updateBatch(createAccountDtos);
  }

  /**
   * Method to get block timestamp from a block height.
   *
   * @async
   * @param {number} height
   * @param {number} nodeCursor
   * @returns {Promise<number>}
   */
  async getBlockTimestamp(height: number, nodeCursor: number): Promise<number> {
    const block = await this.blockRepositories[nodeCursor]
      .getBlockByHeight(UInt64.fromUint(height))
      .toPromise();
    if (!block) throw new Error('Cannot query block from height');
    const timestamp = this.getNetworkTimestampFromUInt64(block.timestamp);
    return timestamp * 1e3;
  }

  /**
   * Method to convet network timestamp to world timestamp.
   *
   * @param   {number} timestamp network timestamp
   * @returns {number}           world timestamp
   */
  getNetworkTimestampFromUInt64(timestamp: UInt64): number {
    const timestampNumber = timestamp.compact();
    const epochAdjustment = this.configService.get<number>(
      'network.epochAdjustment',
    );
    return Math.round(timestampNumber / 1000) + epochAdjustment;
  }
}
