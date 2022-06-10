/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { PagePaginatedQueryDto } from './paginated-result.dto';

/**
 * @class AccountDiscoveryState
 * @description A class that represents the state of accounts discovery service.
 *
 * @since v0.1.0
 */
export class AccountsDiscoveryState {
  currentTxPage: number;
  latestTxHash: string;
}

/**
 * @type StateData
 * @description A type that represents the state data of a {@link State} schema.
 *
 * @since v0.1.0
 */
export type StateData = Record<string, never> | AccountsDiscoveryState;

/**
 * @class StateDto
 * @description A DTO class that represents the {@link State} schema.
 *
 * @since v0.1.0
 */
export class StateDto {
  name: string;
  data: StateData;
}

/**
 * @class StateQueryDto
 * @description A DTO class that represents the State query schema.
 *
 * @extends {PagePaginatedQueryDto} Paginated query
 * @since 0.1.0
 */
export class StateQueryDto extends PagePaginatedQueryDto {
  name?: string;
}
