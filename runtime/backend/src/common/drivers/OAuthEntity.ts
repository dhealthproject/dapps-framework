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
import { ObjectLiteral } from "@dhealth/contracts";

/**
 * @enum OAuthEntityType
 * @description This type enumerates the compatible OAuth entity
 * types. These entities can be *fetched* from data providers and
 * *transformed* uniformly.
 *
 * @since v0.4.0
 */
export enum OAuthEntityType {
  Custom = 0,
  Profile = 1,
  Activity = 2,
}

/**
 * @interface OAuthEntity
 * @description This interface defines the fields and methods of an
 * **OAuth entity** which determines exactly *how* data providers
 * store copies of end-users data.
 * <br /><br />
 * Note that we do not extract and interpret *all fields* that are
 * shared by data providers.
 *
 * @since v0.4.0
 */
export interface OAuthEntity {
  /**
   * The type of entity represented in this object.
   *
   * @access public
   * @readonly
   * @var {OAuthEntityType}
   */
  readonly type: OAuthEntityType;

  /**
   * The column names as they are represented in the backend runtime
   * database.
   * <br /><br />
   * Note that the fields listed here *will be* stored in documents.
   *
   * @access public
   * @readonly
   * @var {string[]}
   */
  readonly columns: string[];

  /**
   * This method extracts the fields of a *remote DTO* into an object
   * that contains fields as defined in {@link BasicRemoteDTO.columns}.
   *
   * @access public
   * @returns {ObjectLiteral}   The *columns* as they can be stored in a document.
   */
  toDocument(): ObjectLiteral;
}
