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

import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
import { DappQR } from "@dhealth/components";
import {
  TransferTransaction,
  Deadline,
  Address,
  PlainMessage,
  NetworkType,
  Transaction,
} from "@dhealth/sdk";

import { QRCodeGenerator } from "@dhealth/qr-library";

@Component({
  components: {
    Header,
    Footer,
    DappQR,
  },
})
export default class OnboardingPage extends MetaView {
  get dummyLinks() {
    return [
      { path: "#", text: "Home", icon: "" },
      { path: "#1", text: "Fitness", icon: "" },
      { path: "#2", text: "Mindfulness", icon: "" },
      { path: "#3", text: "Wellness", icon: "" },
    ];
  }

  // get getQR() {
  //   return QRCodeGenerator;
  // }

  // get networkType() {
  //   return NetworkType.MAIN_NET;
  // }

  // protected createLoginContract() {
  //   return TransferTransaction.create(
  //     Deadline.create(1616978397),
  //     Address.createFromRawAddress("NDEVUP43ATEX2BM6XDFKVELVGQF66HOTZTIMJ6I"),
  //     [],
  //     PlainMessage.create("I am leaving dHealth Tech Chat #4"),
  //     NetworkType.MAIN_NET
  //   );
  // }

  protected createLoginContract(): any {
    console.log(this.getTransactionRequest());
    return QRCodeGenerator.createTransactionRequest(
      this.getTransactionRequest(),
      NetworkType.MAIN_NET,
      "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16"
    );
  }

  protected getTransactionRequest(): Transaction {
    return TransferTransaction.create(
      Deadline.create(1616978397),
      Address.createFromRawAddress("NDEVUP43ATEX2BM6XDFKVELVGQF66HOTZTIMJ6I"),
      [],
      PlainMessage.create("I am leaving dHealth Tech Chat #4"),
      NetworkType.MAIN_NET
    );
  }
}
