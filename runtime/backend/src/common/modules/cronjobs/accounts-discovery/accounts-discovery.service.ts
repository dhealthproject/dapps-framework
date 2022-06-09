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
  TransactionGroup,
  Transaction,
  TransferTransaction,
  Order,
  Page,
} from '@dhealth/sdk';
import { ConfigService } from '@nestjs/config';

// internal dependencies
import { AccountsService } from '../../routes/accounts/accounts.service';
import { AccountDTO } from '../../../models';
import { StatesService } from '../../services/states/states.service';
import { AbstractDiscoveryService } from '../discovery.abstract.service';
import { NetworkService } from '../../services/network/network.service';

/**
 * @class AccountsDiscoveryService
 * @description The main service class for {@link AccountsDiscoveryModule}.
 * Contains the execution logic for `accountsDiscovery` cronjob.
 *
 * @extends     {AbstractDiscoveryService}
 * @implements  {OnModuleInit}
 * @since v0.1.0
 */
@Injectable()
export class AccountsDiscoveryService
  extends AbstractDiscoveryService
  implements OnModuleInit
{
  /**
   * The account map that stores relevant discovered accounts for each run.
   *
   * @access private
   * @var {Map<string, AccountDTO>}
   */
  private accountsMap: Map<string, AccountDTO>;

  /**
   * The constructor of this class.
   * Params will be automatically injected upon called.
   *
   * @param {ConfigService}   configService
   * @param {StatesService}   statesService
   * @param {NetworkService}  networkService
   * @param {AccountsService} accountsService
   */
  constructor(
    private readonly configService: ConfigService,
    private readonly statesService: StatesService,
    private readonly networkService: NetworkService,
    private readonly accountsService: AccountsService,
  ) {
    // required super call
    super();
  }

  /**
   * Method that will run when the module is initialized.
   *
   * The steps are:
   *  1. Initialize inherited logger with this class.
   *  2. Get the dapp public key.
   *  3. Run the main method (immediate run).
   *
   * @async
   * @returns {Promise<void>}
   */
  async onModuleInit(): Promise<void> {
    this.logger = new Logger('[Cron] ' + AccountsDiscoveryService.name);
    this.discoverySource = this.configService.get<string>('dappPublicKey');
    await this.discover();
  }

  /**
   * The main cron method for this class.
   * Runs every 30 minutes.
   *
   * @async
   * @returns {Promise<void>}
   */
  @Cron('*/30 * * * *')
  public async discover(): Promise<void> {
    this.logger.log('Service starting...');
    this.logger.log('Syncing states...');
    await this.syncState();
    this.accountsMap = new Map<string, AccountDTO>();
    const start = new Date().getTime();
    await this.runDiscovery();
    const end = new Date().getTime();
    this.logger.debug('Runtime duration: ' + (end - start) / 1000 + 's');
  }

  /**
   * Method to synchronize this service's state.
   *
   * Retrieve from the database a {@link State} instance with this service's class name.
   * If none existing, return.
   *
   * @async
   * @returns {Promise<void>}
   */
  async syncState(): Promise<void> {
    const state = await this.statesService.findOne({
      name: AccountsDiscoveryService.name,
    });
    if (state) {
      this.state = state;
    }
  }

  /**
   * Method to add all dapp recipient accounts to database.
   *
   * It performs the following:
   *  1. Discover all accounts that receives transaction(s) from discovery source.
   *  2. Get and update the time of the first occured transaction for each account.
   *  3. Save all account's information to database.
   *
   * @async
   * @returns {Promise<void>}
   */
  async runDiscovery(): Promise<void> {
    this.logger.log('Discovering accounts...');
    await this.discoverAccounts();
    this.logger.log('Updating first transaction time...');
    await this.updateFirstTransactionsTime();
    this.logger.log('Updating accounts...');
    await this.saveAccounts(Array.from(this.accountsMap.values()));
  }

  /**
   * Method to discover all dapp recipient accounts.
   *
   * It performs the following:
   *  1. Query 10 pages of transactions that has the discovery source as signer.
   *  2. For each transaction get the recipient address.
   *  3. Create an {@link AccountDTO} for each recipient and group them in {@link accountsMap} map
   *
   * @async
   * @returns {Promise<void>}
   */
  async discoverAccounts(): Promise<void> {
    let pageNumber = this.state ? this.state.data.currentTxPage : 1;
    const pageSize = 100;
    for (let i = 0; i < 10; i++) {
      const result = await this.networkService.transactionRepository
        .search({
          signerPublicKey: this.discoverySource,
          group: TransactionGroup.Confirmed,
          embedded: true,
          order: Order.Asc,
          pageNumber: pageNumber++,
          pageSize,
        })
        .toPromise();
      await this.handleTransactions(result.data);
      if (result.isLastPage || i === 9) {
        await this.saveState(
          result.isLastPage ? pageNumber - 1 : pageNumber,
          result,
        );
        break;
      }
    }
  }

  /**
   * Handles a page of transactions.
   * Check if the list of input transaction contains the latest processed transaction hash.
   * If it exists, only process from the transaction after it.
   *
   * @async
   * @param {Transaction[]} transactions
   * @returns {Promise<void>}
   */
  async handleTransactions(transactions: Transaction[]): Promise<void> {
    if (this.state) {
      const latestTxHash = this.state.data.latestTxHash;
      const hashIndex = transactions.map((tx: Transaction) =>
        tx.transactionInfo.hash
          ? tx.transactionInfo.hash
          : (tx.transactionInfo as any).aggregateHash,
      );
      if (hashIndex.includes(latestTxHash)) {
        transactions.splice(0, hashIndex.indexOf(latestTxHash) + 1);
      }
    }
    for (const transaction of transactions) {
      await this.handleTransaction(transaction);
    }
  }

  /**
   * Handles one transaction.
   *
   * The rules are:
   *  - If it's not a transfer transaction: disregard it.
   *  - It it is:
   *    - Check if it exists in {@link accountsMap}
   *      - It it exists, increment its total transaction count by one.
   *      - It it doesn't, create a new {@link accountDto} instance and add to {@link accountsMap}.
   *
   * @async
   * @param {Transaction} transaction
   * @returns {Promise<void>}
   */
  async handleTransaction(transaction: Transaction): Promise<void> {
    if (
      transaction instanceof TransferTransaction &&
      transaction.recipientAddress
    ) {
      const address = transaction.recipientAddress.plain();
      const cachedRecipient = this.accountsMap.get(address);
      if (cachedRecipient) {
        cachedRecipient.transactionsCount++;
        return;
      }
      const accountDto = await this.createAccountDTO(transaction);
      this.accountsMap.set(transaction.recipientAddress.plain(), accountDto);
    }
  }

  /**
   * Method to create a new AccountDTO for the purpose of this cronjob.
   *
   * The rules are:
   *  - Query the database for this account address.
   *    - If there's a result, return it as an {@link AccountDTO}.
   *    - If there's no result, return a new {@link AccountDTO} with the details extracted from the transaction.
   *
   * @async
   * @param   {TransferTransaction} transaction
   * @returns {Promise<AccountDTO>}
   */
  async createAccountDTO(
    transaction: TransferTransaction,
  ): Promise<AccountDTO> {
    const address = transaction.recipientAddress.plain();
    const recipientFindResult = await this.accountsService.find({ address });
    if (recipientFindResult.data.length > 0) {
      const recipient = recipientFindResult.data[0];
      recipient.transactionsCount++;
      return recipient as AccountDTO;
    }
    return {
      address: transaction.recipientAddress.plain(),
      transactionsCount: 1,
      firstTransactionAtBlock: transaction.transactionInfo.height.compact(),
    };
  }

  /**
   * Method to update all first-transactions time.
   *
   * @async
   * @returns {Promise<void>}
   */
  async updateFirstTransactionsTime(): Promise<void> {
    for (const key of this.accountsMap.keys()) {
      const account = this.accountsMap.get(key);
      if (account.firstTransactionAt) continue;
      const height = account.firstTransactionAtBlock;
      const timestamp = await this.networkService.getBlockTimestamp(height);
      this.accountsMap.get(key).firstTransactionAt = new Date(timestamp);
    }
  }

  /**
   * Method to save recipient accounts to database.
   *
   * @async
   * @param   {AccountDTO[]} createAccountDtos
   * @returns {Promise<void>}
   */
  async saveAccounts(createAccountDtos: AccountDTO[]): Promise<void> {
    if (createAccountDtos && createAccountDtos.length > 0)
      await this.accountsService.updateBatch(createAccountDtos);
  }

  /**
   * Method to save this service's current state to the database.
   *
   * @async
   * @param {number}            currentTxPage
   * @param {Page<Transaction>} result
   * @returns {Promise<void>}
   */
  async saveState(
    currentTxPage: number,
    result: Page<Transaction>,
  ): Promise<void> {
    if (result.data.length === 0) return;
    const latestTx = result.data[result.data.length - 1];
    const latestTxHash = latestTx.transactionInfo.hash
      ? latestTx.transactionInfo.hash
      : (latestTx.transactionInfo as any).aggregateHash;
    this.state = {
      name: AccountsDiscoveryService.name,
      data: {
        currentTxPage,
        latestTxHash,
      },
    };
    await this.statesService.updateOne(this.state);
  }
}
