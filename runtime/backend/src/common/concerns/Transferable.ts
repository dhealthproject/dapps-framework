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
import { BaseDTO } from "../models/BaseDTO";

/**
 * @label COMMON
 * @class Transferable
 * @description This concern requires the presence of fields that
 * consist in delivering *transferable* information. This concerns
 * data that can be **persisted** in the mongo database but also
 * **transferred** (DTOs).
 * <br /><br />
 * This class defines a generic type template `DTOType` that should
 * be used with DTO classes, e.g. `StateDTO`, `AccountDTO`, etc.
 * <br /><br />
 * We provide a base implementation for the {@link toDTO} method to
 * standardize the retrieval and formatting of DTOs from their
 * origin database documents.
 *
 * @abstract
 * @todo Add usage example, for example as illustrated in {@link StateSchema}.
 * @since v0.2.0
 */
export abstract class Transferable<TDTOType extends BaseDTO> {
  /**
   * Returns the data transfer object related to an individual
   * entity and thereby we consider it to be **transferable**.
   * <br /><br />
   * Note that this helper method uses type-inferrence to determine
   * which fields are kept or not from an origin model object.
   *
   * @access public
   * @returns {TDTOType}
   */
  public abstract get toDTO(): TDTOType;
}
