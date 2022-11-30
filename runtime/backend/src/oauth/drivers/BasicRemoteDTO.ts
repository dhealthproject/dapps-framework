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

// internal dependencies
import { OAuthEntity, OAuthEntityType } from "./OAuthEntity";

/**
 * @label OAUTH
 * @class BasicRemoteDTO
 * @description This class defines the fields and methods of a
 * **basic remote entity's DTO** as defined by custom data providers.
 *
 * @since v0.4.0
 */
export class BasicRemoteDTO implements OAuthEntity {
  /**
   * The type of entity represented in this object.
   *
   * @access public
   * @readonly
   * @var {OAuthEntityType}
   */
  public readonly type: OAuthEntityType = OAuthEntityType.Custom;

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
  public readonly columns: string[] = [];

  /**
   * This method extracts the fields of a *remote DTO* into an object
   * that contains fields as defined in {@link BasicRemoteDTO.columns}.
   *
   * @access public
   * @returns {ObjectLiteral}   The *columns* as they can be stored in a document.
   */
  public toDocument(): ObjectLiteral {
    // prepare
    const result: any = {};

    // extract column values into object
    this.columns.forEach((c) => (result[c] = (this as any)[c]));

    // returns object literal
    return result;
  }

  /**
   * This constructor is private as to avoid the creation of instances
   * *outside of this implementation*. This allows us to make sure that
   * activities as *scoped inside the Strava OAuth Driver*, always use
   * the correct format and are always transformed correctly.
   * <br /><br />
   * To create an instance of this class, you must use the static method
   * {@link BasicRemoteDTO.createFromObject}.
   *
   * @access protected
   */
  protected constructor() {}
}
