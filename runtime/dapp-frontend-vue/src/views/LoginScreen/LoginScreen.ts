/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

// external dependencies
import { Component } from "vue-property-decorator";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import ElevateLogo from "@/components/ElevateLogo/ElevateLogo.vue";
import DividedScreen from "@/components/DividedScreen/DividedScreen.vue";

import { DappQR } from "@dhealth/components";
import {
  TransferTransaction,
  Deadline,
  Address,
  PlainMessage,
  NetworkType,
  Transaction,
  Mosaic,
  MosaicId,
  UInt64,
} from "@dhealth/sdk";
import { QRCodeGenerator } from "@dhealth/qr-library";

import { DappButton } from "@dhealth/components";

export interface TransactionRequestConfig {
  deadline: Deadline;
  address: Address;
  mosaic: Array<any>;
  message: PlainMessage;
  network: number;
  uiInt: UInt64;
}

@Component({
  components: {
    ElevateLogo,
    DappQR,
    DappButton,
    DividedScreen,
  },
})
export default class LoginScreen extends MetaView {
  protected selectedIndex = 0;

  get carouselItems(): string[] {
    return [
      "Keep a digital wardrobe of your gear as an NFT",
      "Open dHealth Signer app on your phone",
      "Tap on scan from the bottom nav bar",
    ];
  }

  get tutorialItems(): string[] {
    return [
      "Open dHealth Signer app on your phone",
      "Tap on scan from the bottom nav bar",
      "Point your phone to the screen to capture the code",
    ];
  }

  /**
   * Helper method that generates
   * transaction request config
   *
   * @access protected
   * @returns Transaction
   */
  protected getTransactionRequest(
    config: TransactionRequestConfig
  ): Transaction {
    const { deadline, address, mosaic, message, network, uiInt } = config;

    return TransferTransaction.create(
      deadline,
      address,
      mosaic,
      message,
      network,
      uiInt
    );
  }

  /**
   * Helper computed which defines transaction request field
   * moved to computed so it could be available in template
   *
   * @returns {TransactionRequestConfig}
   */
  get transactionRequestConfig(): TransactionRequestConfig {
    return {
      deadline: Deadline.create(1616978397),
      address: Address.createFromRawAddress(
        "NDEVUP43ATEX2BM6XDFKVELVGQF66HOTZTIMJ6I"
      ),
      mosaic: [
        new Mosaic(new MosaicId("39E0C49FA322A459"), UInt64.fromUint(0)),
      ],
      message: PlainMessage.create("This is hardcoded login QR"),
      network: NetworkType.MAIN_NET,
      uiInt: UInt64.fromUint(0),
    };
  }

  /**
   * Helper method for
   * generating QR code request
   * which goes into :qr-code prop
   *
   * @access protected
   * @returns any
   */
  protected createLoginContract(): any {
    return QRCodeGenerator.createTransactionRequest(
      this.getTransactionRequest(this.transactionRequestConfig),
      NetworkType.MAIN_NET,
      "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16"
    );
  }
}
