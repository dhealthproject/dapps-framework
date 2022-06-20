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
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { /*NetworkType,*/ PublicAccount } from "@dhealth/sdk";

/**
 * @class AppService
 * @description This class is used to initialize the software
 * and provides general network and dApp configuration.
 * <br /><br />
 * This class is *injectable* and *provided* by the {@link AppModule}
 * through a call to the static {@link AppModule.register} helper
 * method.
 *
 * @since v0.1.0
 */
@Injectable()
export class AppService {
  /**
   * The currently configured dApp public account information
   * that should (but not must) be available on the network.
   * <br /><br />
   * We use this public information (a public key) to create
   * user-friendly addresses that always start with a `N`.
   *
   * @access protected
   * @var {PublicAccount}
   */
  protected dappPublicAccount: PublicAccount;

  /**
   * The type of network that is used. Using dHealth, the type
   * of network can be `TESTNET` or `MAINNET`, which respectively
   * map to `152` and `104`.
   * <br /><br />
   * Note that changing this configuration field affects the
   * {@link dappPublicAccount} property as well and may incur
   * a change of *connection* or compatibility.
   *
   * @access protected
   * @var {number}
   */
  protected networkType: number;

  /**
   * The blockchain network *identifier*. This field is used
   * in relation with *transaction signatures* to identify a
   * network and restricts the use of *signed* payloads.
   * <br /><br />
   * This configuration field is network-wide and changing it
   * may incur a change of *connection* or compatibility.
   *
   * @access protected
   * @var {string}
   */
  protected generationHash: string;

  /**
   * The UTC-adjustment (in seconds) to add to block timestamps
   * when formatting to UTC time.
   * <br /><br />
   * This configuration field is network-wide and changing it
   * may incur a change of *connection* or compatibility.
   *
   * @access protected
   * @var {number}
   */
  protected epochAdjustment: number;

  /**
   * Constructs an instance of the AppService that is used
   * internally as the kernel of this software.
   * <br /><br />
   * The instance is built around the configuration files
   * using nest's `ConfigService`.
   *
   * @access public
   * @param {ConfigService} configService   A nestjs ConfigService instance (automatically injected).
   */
  constructor(private readonly configService: ConfigService) {
    // read blockchain identifier from config
    this.generationHash = this.configService.get<string>(
      "network.generationHash",
    );

    // read UTC timestamp adjustment value
    this.epochAdjustment = this.configService.get<number>(
      "network.generationHash",
    );

    // read type of network to determine whether the
    // dApp address starts with `N` (mainnet) or `T` (testnet)
    this.networkType = this.configService.get<number>(
      "network.networkIdentifier",
    );

    // read a public key to start with
    //const dappPublicKey = this.configService.get<string>("dappPublicKey");

    // interprets the dApp public information
    // this.dappPublicAccount = PublicAccount.createFromPublicKey(
    //   dappPublicKey,
    //   this.networkType as NetworkType
    // );
  }
}
