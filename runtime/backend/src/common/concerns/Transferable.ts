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
 * <br /><br />
 * @example Extending and using the `Transferable`
 * ```typescript
 *  import { Transferable } from "./Transferable";
 *
 *  class Example extends Transferable<ExampleDTO> {
 *    @Prop()
 *    testProp: string;
 *
 *    // Overrides from Transferable
 *    public static fillDTO(doc: ExampleDocument, dto: ExampleDTO) {
 *      dto.testProp = doc.testProp;
 *      return dto;
 *    }
 *  }
 * ```
 *
 * @abstract
 * @since v0.2.0
 */
export abstract class Transferable<TDTOType extends BaseDTO> {
  /**
   * This *static* method populates a DTO object from the
   * values of a document as presented by mongoose queries.
   * <br /><br />
   * CAUTION: This method must be implemented in child classes
   * in order to provide *restricted* transferable fields. This
   * method should not be used directly as it does no exclusion
   * of fields as would be usual for transferable DTOs.
   *
   * @internal This method should not be used directly. Use child classes' implementation instead.
   * @access public
   * @static
   * @param   {any}   doc   The document as received from mongoose.
   * @param   {any}   dto   The DTO object that will be populated with values.
   * @returns {any}   The `dto` object with fields set.
   */
  public static fillDTO(doc: any, dto: any): any {
    // CAUTION: This method must be implemented in child classes
    //          in order to provide *restricted* transferable fields
    // This method should not be used as it is not securely excluding
    // some fields, which would be usual for DTO types.
    dto = doc as any;
    return dto;
  }
}
