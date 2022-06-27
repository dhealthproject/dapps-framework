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
import { Command, CommandRunner } from "nest-commander";
import { ConfigService } from "@nestjs/config";
import {
  Transaction,
  TransactionGroup,
  TransactionType,
  TransferTransaction,
  Order,
  Page,
} from "@dhealth/sdk";

// internal dependencies
import { StateService } from "../../../common/services/StateService";
import { NetworkService } from "../../../common/services/NetworkService";
import { DiscoveryCommand, DiscoveryCommandOptions } from "../DiscoveryCommand";

/**
 * @class DiscoverTransactions
 * @description The implementation for the transaction discovery
 * scheduler. Contains source code for the execution logic of a
 * command with name: `discovery:transactions`.
 *
 * @since v0.2.0
 */
@Command({
  name: "discovery:transactions",
  arguments: "<mode>",
  options: { isDefault: false },
  argsDescription: {
    "mode": "One of: 'incoming', 'outgoing' or 'both' (defaults to 'incoming')"
  }
})
export class DiscoverTransactions
  extends DiscoveryCommand
  implements CommandRunner
{
  /**
   * The constructor of this class.
   * Params will be automatically injected upon called.
   *
   * @param {ConfigService}   configService
   * @param {StateService}   stateService
   * @param {NetworkService}  networkService
   */
  constructor(
    protected readonly configService: ConfigService,
    protected readonly stateService: StateService,
    protected readonly networkService: NetworkService,
  ) {
    // required super call
    super(stateService);
  }

  /**
   * This method must return a *command name*. Note that
   * it should use only characters of: A-Za-z0-9:-_.
   * <br /><br />
   * e.g. "scope:name"
   *
   * @see DiscoveryCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get command(): string {
    return `${this.scope}:transactions`;
  }

  /**
   * This method must return a *command signature* that
   * contains hints on the command name and its required 
   * and optional arguments.
   * <br /><br />
   * e.g. "command <argument> [--option value]"
   *
   * @see DiscoveryCommand
   * @see BaseCommand
   * @access protected
   * @returns {string}
   */
  protected get signature(): string {
    return `${this.command} [--source "SOURCE-ADDRESS-OR-PUBKEY"]`;
  }

  /**
   * 
   *
   * @access public
   * @async
   * @param   {DiscoveryCommandOptions}   options
   * @returns {Promise<void>}
   */
  public async discover(options?: DiscoveryCommandOptions): Promise<void> {

    this.logger.debug(
      `Starting discovery command with: ${JSON.stringify(options, null, 2)}`
    );

    // reads custom `states` document value
    const pageNumber = this.state && this.state.data ? this.state.data.lastPageNumber : 1;

    // initialize a connection to the node
    // and prepare a transaction query (to REST gateway)
    const nodeRequests = this.networkService.getTransactionRepository();
    const nodeTxQuery = this.getTransactionQuery(pageNumber);

    // by default we query only **confirmed** transactions
    // these are transactions that are *included in a block*.
    const transactionPromises = [
      nodeRequests.search({
        ...nodeTxQuery,
        group: TransactionGroup.Confirmed,
      }).toPromise(),
    ];

    // we permit to include **unconfirmed** transactions
    // with the option `--include-unconfirmed`.
    if (undefined !== options.includeUnconfirmed) {
      transactionPromises.push(nodeRequests.search({
        ...nodeTxQuery,
        group: TransactionGroup.Unconfirmed,
      }).toPromise())
    }

    // we permit to include **partial** transactions (aggregate bonded)
    // with the option `--include-partial`.
    if (undefined !== options.includePartial) {
      transactionPromises.push(nodeRequests.search({
        ...nodeTxQuery,
        group: TransactionGroup.Partial,
      }).toPromise())
    }

    const transactionPages = await Promise.all(transactionPromises);

    this.logger.debug(
      `Transaction pages received: ${JSON.stringify(transactionPages, null, 2)}`
    );
  }

  /**
   * 
   * @returns 
   */
  protected getTransactionQuery(
    pageNumber: number = 1,
    transactionTypes: TransactionType[] = [TransactionType.TRANSFER],
    unfoldEmbedded: boolean = false,
    pageSize: number = 100,
    order: Order = Order.Desc,
  ): any {
    // should hold one of: "incoming", "outgoing" or "both"
    const queryMode: string = this.argv[0];

    // returns a REST-compatible query
    const baseQuery: any = {
      type: transactionTypes,
      embedded: unfoldEmbedded,
      order: Order.Desc,
      pageNumber,
      pageSize,
    };

    if (["incoming", "both"].includes(queryMode)) {
      baseQuery["recipientAddress"] = this.discoverySource;
    }

    if (["outgoing", "both"].includes(queryMode)) {
      baseQuery["address"] = this.discoverySource;
    }

    return baseQuery;
  }
}
