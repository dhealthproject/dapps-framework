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
import { DappQR } from "@dhealth/components";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import Header from "@/components/Header/Header.vue";
import Footer from "@/components/Footer/Footer.vue";
import Loader from "@/components/Loader/Loader.vue";
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
  /**
   * This property is used for
   * calling related API endpoints
   *
   * @access public
   * @var {service}
   */
  protected service: Auth = new Auth();

  /**
   * This property is used to
   * see if any API call is being processed
   *
   * @access public
   * @var {loading}
   */
  // commented @Prop below to avoid "missing prop" error
  // @Prop({
  //   type: Boolean,
  //   required: true,
  //   default: true,
  // })
  protected loading?: boolean;

  /**
   *
   */
  protected hasLoaded = false;

  /**
   * This property is used for storing the received message
   * from the backend request to `/auth/challenge`.
   *
   * @access public
   * @var {authMessage}
   */
  protected authMessage = "";

  /**
   * This property is used for storing a pointer to
   * the interval that fetches the authentication token.
   *
   * @access public
   * @var {interval}
   */
  protected interval?: ReturnType<typeof setTimeout>;

  /**
   * This property is used for storing a pointer to
   * the timeout which stops calling auth request after 5 minutes.
   *
   * @access public
   * @var {globalIntervalTimer}
   */
  protected globalIntervalTimer?: ReturnType<typeof setTimeout>;

  /**
   * Draft computed for generating
   * router-links for header/footer
   *
   * @returns HeaderLink[]
   */
  get dummyLinks() {
    return [
      { path: "#", text: "Home", icon: "icons/Home.svg" },
      { path: "#1", text: "Fitness", icon: "icons/Running.svg" },
      { path: "#2", text: "Mindfulness", icon: "icons/Yoga.svg" },
      { path: "#3", text: "Wellness", icon: "icons/Apple.svg" },
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
   *
   */
  public get isLoading(): boolean {
    return this.loading === true || !this.hasLoaded;
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
        tokenResponse = await this.service.login(reqBody);

        if (tokenResponse && !!this.interval) {
          clearInterval(this.interval);
          // replace secure: false for the development purposes, should be true
          // Cookies.set("accessToken", tokenResponse.data.accessToken, {
          //   secure: false,
          //   sameSite: "strict",
          //   domain: "localhost",
          // });
          this.service.setAuthCookie(tokenResponse.data.accessToken);

          this.$router.push({ name: "legal.terms-of-service" });
        }
      }, 5000);

      // Clear interval if during 5 minutes didn't receive token
      this.globalIntervalTimer = setTimeout(() => {
        if (this.interval) {
          clearInterval(this.interval);
        }
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
      const code = this.$route.params.refCode;

      if (this.$route.params.refCode) {
        Cookies.set("refCode", code, {
          secure: false,
          sameSite: "strict",
          domain: "localhost",
        });
      }

      const resp = await this.service.getAuthChallenge();
      if (resp?.data) {
        this.authMessage = resp.data;
      }

      this.getToken();
    } catch (err) {
      console.error(err);
    } finally {
      this.hasLoaded = true;
    }
  }

  beforeDestroyed() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.globalIntervalTimer) {
      clearTimeout(this.globalIntervalTimer);
    }
  }
}
