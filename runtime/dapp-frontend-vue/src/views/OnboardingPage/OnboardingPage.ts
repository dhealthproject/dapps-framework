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
import { Component, Prop } from "vue-property-decorator";
import Cookies from "js-cookie";
// internal dependencies
import { MetaView } from "@/views/MetaView";
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
import Loader from "@/components/Loader/Loader.vue";
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

import { Auth } from "@/modules/Auth/Auth";

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
    Header,
    Footer,
    DappQR,
    Loader,
  },
})
export default class OnboardingPage extends MetaView {
  @Prop({
    type: Object,
    required: false,
    default() {
      return new Auth();
    },
  })

  /**
   * This property is used for
   * calling related API endpoints
   *
   * @access public
   * @var {service}
   */
  service?: Auth;

  /**
   * This property is used to
   * see if any API call is being processed
   *
   * @access public
   * @var {loading}
   */
  loading = false;

  /**
   * This property is used for storing
   * received message from GET auth/challenge
   *
   * @access public
   * @var {authMessage}
   */
  authMessage = "";

  /**
   * This property is used
   * for storing pointer to
   * interval for getting auth token
   *
   * @access public
   * @var {interval}
   */
  interval: undefined | number = undefined;

  /**
   * This property is used
   * for storing pointer to
   * the timeout which stops
   * calling auth request after 5 minutes
   *
   * @access public
   * @var {globalIntervalTimer}
   */
  globalIntervalTimer: undefined | number = undefined;

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
   * Helper method to run authentication process
   *
   * @access protected
   * @returns void
   */
  protected getToken(): void {
    const isAuth = Cookies.get("accessToken");

    if (!isAuth) {
      const reqBody = {
        address: "",
        authCode: "not test",
      };
      let tokenResponse = null;

      // Request token each 5 seconds until receive 200 response
      this.interval = setInterval(async () => {
        tokenResponse = await this.service?.login(reqBody);

        if (tokenResponse) {
          clearInterval(this.interval);
          // replace secure: false for the development purposes, should be true
          // Cookies.set("accessToken", tokenResponse.data.accessToken, {
          //   secure: false,
          //   sameSite: "strict",
          //   domain: "localhost",
          // });
          this.service?.setAuthCookie(tokenResponse.data.accessToken);

          this.$router.push({ name: "termsofservice" });
        }
      }, 5000);

      // Clear interval if during 5 minutes didn't receive token
      this.globalIntervalTimer = setTimeout(() => {
        clearInterval(this.interval);
      }, 300000);
    }
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

  async mounted() {
    try {
      this.loading = true;

      const resp = await this.service?.getAuthChallenge();
      if (resp?.data) {
        this.authMessage = resp.data;
      }

      this.getToken();
    } catch (err) {
      console.error(err);
    } finally {
      this.loading = false;
    }
  }

  beforeDestroyed() {
    clearInterval(this.interval);
    clearTimeout(this.globalIntervalTimer);
  }
}
