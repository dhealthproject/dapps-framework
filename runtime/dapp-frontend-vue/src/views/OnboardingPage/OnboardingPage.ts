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
import axios from "axios";
// internal dependencies
import { MetaView } from "@/views/MetaView";
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
import Preloader from "@/components/Preloader/Preloader.vue";
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

export interface transactionRequestConfig {
  deadline: Deadline;
  address: Address;
  mosaic: Array<any>;
  message: PlainMessage;
  network: number;
  uiInt: UInt64;
}

interface RequestHandler {
  call(method: string, url: string, options: any): Record<string, any>;
}

class HttpRequestHandler {
  public call(method: string, url: string, options: any) {
    if (method === "GET") {
      return axios.get(url, options);
    }
    // POST
    // PATCH
  }
}

class BackendService {
  protected baseUrl = "http://localhost:7903";
  protected handler: HttpRequestHandler = new HttpRequestHandler();

  public getUrl(endpoint: string): string {
    return `${this.baseUrl}/${endpoint.replace("^/", "")}`;
  }

  public async getAuthChallenge(): Promise<any> {
    const res = await this.handler.call("GET", this.getUrl("auth/code"), {});
    return res;
  }
}

@Component({
  components: {
    Header,
    Footer,
    DappQR,
    Preloader,
  },
})
export default class OnboardingPage extends MetaView {
  /**
   * loading state property
   */
  loading = false;

  authMessage = "";

  /**
   * Draft computed for generating
   * router-links for header/footer
   *
   * @returns HeaderLink[]
   */
  get dummyLinks() {
    return [
      { path: "#", text: "Home", icon: "" },
      { path: "#1", text: "Fitness", icon: "" },
      { path: "#2", text: "Mindfulness", icon: "" },
      { path: "#3", text: "Wellness", icon: "" },
    ];
  }
  /**
   * Helper computed which defines transaction request field
   * moved to computed so it could be available in template
   *
   * @returns {transactionRequestConfig}
   */
  get transactionRequestConfig(): transactionRequestConfig {
    return {
      deadline: Deadline.create(1616978397),
      address: Address.createFromRawAddress(
        "NDEVUP43ATEX2BM6XDFKVELVGQF66HOTZTIMJ6I"
      ),
      mosaic: [
        new Mosaic(new MosaicId("39E0C49FA322A459"), UInt64.fromUint(0)),
      ],
      message: PlainMessage.create(this.authMessage),
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
  /**
   * Helper method that generates
   * transaction request config
   *
   * @access protected
   * @returns Transaction
   */
  protected getTransactionRequest(
    config: transactionRequestConfig
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

  async mounted() {
    try {
      this.loading = true;
      const service = new BackendService();
      const resp = await service.getAuthChallenge();
      console.log({ resp });
      this.authMessage = resp.data.message;
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }
}
