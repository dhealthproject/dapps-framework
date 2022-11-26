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

// internal dependencies
import { BaseDTO } from "./BaseDTO";

/**
 * @class DappConfigDTO
 * @description A DTO class that consists of configuration details of a dApp.
 * <br /><br />
 * This class is used mostly to configure the frontend display abilities.
 *
 * @since v0.5.0
 */
export class DappConfigDTO extends BaseDTO {
  /**
   * A public name for the dApp. This name is used across module
   * implementations to describe the currently configured dApp.
   * <br /><br />
   * Note that by changing the name of a dApp, it will affect the
   * contract payloads that are written on-chain because the contract
   * signature includes the dApp name.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "ELEVATE",
    description:
      "A public name for the dApp. This name is used across module " +
      "implementations to describe the currently configured dApp.",
  })
  public dappName: string;

  /**
   * A public key or address of an account on dHealth Network which
   * is used as a registry for operations of authentication.
   * <br /><br />
   * Note that by changing this configuration field, it will affect the
   * contract payloads that are written on-chain because the authentication
   * registry is included in transactions and contract payloads.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "NBLT42KCICXZE2Q7Q4SWW3GWWE3XWPH3KUBBOEY",
    description:
      "A public key or address of an account on dHealth Network which " +
      "is used as a registry for operations of authentication.",
  })
  public authRegistry: string;

  /**
   * The number of decimal places that are considered for the
   * configured **earn** asset.
   * <br /><br />
   * Note that changing this value may affect the values that
   * are displayed by the backend runtime. The number of decimal
   * places that one asset takes is configured on dHealth Network
   * as the *divisibility* of the asset (mosaic).
   * <br /><br />
   * Note also that the frontend runtime uses this configuration
   * field to determine how to calculate a *relative* amount out
   * of an *absolute* amount. Amounts in the backend runtime are
   * always expressed in *absolute form*, using their smallest
   * unit of account possible.
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "number",
    example: 6,
    description:
      "The number of decimal places that are considered for the configured asset.",
  })
  public earnAssetDivisibility: string | number;

  /**
   * The mosaic identifier for the configured **earn** asset.
   * <br /><br />
   * Note that by changing this value, it will affect the contract
   * payloads that are created.
   * <br /><br />
   * Note also that the frontend runtime uses this configuration
   * field to determine *which assets* are attached to a given
   * contract payload (and transfer transaction).
   *
   * @access public
   * @var {string}
   */
  @ApiProperty({
    type: "string",
    example: "4ADBC6CEF9393B90",
    description: "The URL used to *share content* on said social platform.",
  })
  public earnAssetIdentifier: string;
}
