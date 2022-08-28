/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @class BaseDTO
 * @description A DTO class that consists of the *transferable* properties
 * of a document. Typically this includes information *that is already made
 * public* or is known from dHealth Network.
 * <br /><br />
 * This class shall be used in **HTTP responses** to avoid any additional
 * data about accounts to be revealed.
 *
 * @todo Currently this is using a "to any"-cast trick that should be avoided.
 * @since v0.3.0
 */
export class BaseDTO {
  /**
   *
   */
  public constructor() {}
}
