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
import { ApiProperty } from "@nestjs/swagger";

/**
 * @class TokenRequestDTO
 * @description A DTO class that defines the requirements of
 * *requests* for authentication tokens.
 *
 * @since v0.1.0
 */
export class TokenRequestDTO {
  /**
   * Contains the *address* of the dHealth account that is trying
   * to authenticate, i.e. in other APIs this would be the "email".
   *
   * @access public
   * @var {string}
   */
  @ApiProperty()
  public address: string;

  /**
   * Contains the *authentication code* that must be used on-chain
   * to authorize the access using a given {@link address}, i.e.
   * in other APIs this would map to the "password".
   * <br /><br />
   * Note that this authentication code must be *attached* to an
   * encrypted transfer transaction on dHealth Network, which also
   * requires it to be **signed** accordingly.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty()
  public authCode: string;
}
