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
import { Auth as AuthContract, AuthParameters } from "@dhealth/contracts";
import { DappQR } from "@dhealth/components";
import {
  TransferTransaction,
  Deadline,
  Address,
  PlainMessage,
  NetworkType,
  Mosaic,
  MosaicId,
  UInt64,
} from "@dhealth/sdk";
import { QRCode, QRCodeGenerator } from "@dhealth/qr-library";
import { Component } from "vue-property-decorator";
import { mapGetters } from "vuex";
import InlineSvg from "vue-inline-svg";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import ElevateLogo from "@/components/ElevateLogo/ElevateLogo.vue";
import DividedScreen from "@/components/DividedScreen/DividedScreen.vue";
import { AccessTokenDTO } from "@/services/AuthService";
import NavPanel from "@/components/NavPanel/NavPanel.vue";
import UiButton from "@/components/UiButton/UiButton.vue";
import Loader from "@/components/Loader/Loader.vue";

// style resource
import "./LoginScreen.scss";

/**
 * @type CarouselItem
 * @description This type is used to define requirements of items that
 * are used in this components template to fill a *carousel* with text
 * in multiple pages.
 *
 * @since v0.3.0
 */
export interface CarouselItem {
  id: string;
  text: string;
}

/**
 * @type TutorialStepItem
 * @description This type is used to define requirements of items that
 * are used in this components template to fill a *tutorial* with text
 * in multiple steps.
 *
 * @since v0.3.0
 */
export interface TutorialStepItem {
  id: string;
  text: string;
}
/**
 * @label PAGES
 * @class LoginScreen
 * @description This class implements a Vue component to display
 * the authentication / log-in screen of the dApp.
 *
 * @todo The {@link service} property should come from vuex store, not be a component property.
 * @since v0.3.0
 */
@Component({
  components: {
    ElevateLogo,
    DappQR,
    UiButton,
    DividedScreen,
    NavPanel,
    InlineSvg,
    Loader,
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      authChallenge: "auth/getChallenge",
      authRegistry: "auth/getAuthRegistry",
      refCode: "auth/getRefCode",
    }),
    tutorialItems: () => ({}),
  },
})
export default class LoginScreen extends MetaView {
  /**
   * This property is used to as an *indexed* sequence to determine
   * the currently selected tab.
   *
   * @access protected
   * @var {number}
   */
  protected selectedIndex: number = 0;

  /**
   * This property contains generated
   * QR Code configuration generated in `createLoginQRCode()`
   * Gets populated with value on mounted hook
   *
   * @access protected
   * @var {QRCode}
   */
  protected qrConfig: QRCode | null = null;

  /**
   * This property contains the *authentication challenge* as it
   * is requested from the backend API. The end-user must then
   * include this authentication challenge inside a transaction
   * on dHealth Network.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {string}
   */
  public authChallenge!: string;

  /**
   * This property contains the *authentication registry* as it
   * is requested from the backend API. This registry contains the
   * address of the recipient of the authentication transaction on
   * dHealth Network.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {string}
   */
  public authRegistry!: string;

  /**
   * This property contains the *authentication state* as it
   * is requested from the backend API. This property will be
   * set to `true` given a valid and non-expired *access token*
   * is available.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {boolean}
   */
  public isAuthenticated!: boolean;

  /**
   * This property contains the value as set in the store under
   * `auth/userRefCode`.
   * <br /><br />
   * The *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {string}
   */
  public refCode!: string;

  /**
   * This property is used to store a pointer to the interval
   * that executes the `/auth/token` request in the background.
   *
   * @access public
   * @var {ReturnType<typeof setTimeout>}
   */
  protected interval?: ReturnType<typeof setTimeout>;

  /**
   * This property is used to store a pointer to the interval
   * that *stops* the execution of {@link interval} after 5
   * minutes.
   *
   * @access public
   * @var {globalIntervalTimer}
   */
  protected globalIntervalTimer?: ReturnType<typeof setTimeout>;

  /**
   * This property is used to store a pointer to the timeout
   * that calls hint popup after 8 seconds.
   *
   * @access public
   * @var {modalTimer}
   */
  protected modalTimer?: ReturnType<typeof setTimeout>;

  /**
   * This *computed* property is used internally to configure
   * the *tutorial* steps that are displayed on the right
   * of the screen (Steps to use a QRCode).
   *
   * @access protected
   * @returns {TutorialStepItem[]}
   */
  protected get tutorialItems(): TutorialStepItem[] {
    return this.$t("login_screen.steps");
  }

  /**
   * This *computed* property is a helper to create a dApp
   * specific contract that executes an operation within a
   * transfer transaction.
   * <br /><br />
   * This method uses the `@dhealth/contracts` library to
   * create crafted dApp Contracts.
   *
   * @access protected
   * @returns {string}
   */
  protected get authContractJSON(): string {
    // create authentication contract parameters
    const authParameters: AuthParameters = {
      dappIdentifier: "elevate",
      challenge: this.authChallenge,
    };

    // add referral code if not empty
    if (this.refCode && this.refCode.length) {
      authParameters.refCode = this.refCode;
    }

    // when we have a challenge, we can create the QR Code.
    return new AuthContract(authParameters).toJSON();
  }

  /**
   * This *computed* property creates a *transfer transaction*
   * for dHealth Network and attaches the following information:
   * - `deadline`: Adds a **2 hours** deadline that determines when
   *   the transaction expires and must be re-created. Note that
   *   the end-user only has **2 hours** to sign the transaction.
   * - `mosaics`: Adds a 0-amount `dhealth.dhp` mosaic attachment
   *   to permit backwards-compatibility for scanning the created
   *   QR Code with dHealth Mobile Wallet.
   * - `message`: Adds a *contract JSON payload* as defined in
   *   `@dhealth/contracts` and uses the `Auth` contract class.
   * <br /><br />
   * Note that transactions created here *always* have a deadline
   * of **2 hours** in the future which means that the transaction
   * can be signed and broadcast on dHealth during *2 hours*.
   *
   * @access protected
   * @returns {TransferTransaction}
   */
  protected get transactionRequest(): TransferTransaction {
    return TransferTransaction.create(
      // uses dHealth Network's epochAdjustment and sets the default
      // deadline of *2 hours* for the created transfer transaction
      Deadline.create(1616978397),
      // uses ELEVATE's authentication registry as a first draft
      // @todo This should be part of the configuration of ELEVATE
      Address.createFromRawAddress(this.authRegistry),
      // setting 0-mosaic is necessary to reach backwards-compatibility
      // with dHealth Mobile Wallet QR Code Scanner, which requires it.
      [new Mosaic(new MosaicId("39E0C49FA322A459"), UInt64.fromUint(0))],
      // attaches the contract JSON payload to the message field
      // of the transfer transaction such that this operation is valid
      PlainMessage.create(this.authContractJSON),
      NetworkType.MAIN_NET,
      // maxFee-0 permits *new accounts* to log-in too.
      UInt64.fromUint(0)
    );
  }

  /**
   * This property contains client side websocket connection
   * which is initialized in the `mounted()` hook.
   *
   * @access public
   * @returns {WebSocket | undefined}
   */
  public wsConnection: WebSocket | undefined;

  /**
   * This method returns payload necessary for mobile to open Signer App for an authentication
   *
   * @access protected
   * @returns {string}
   */
  protected get mobileHref(): string {
    // prefix is different based on whether the signer app is published
    // through *app stores* or not (Testflight / Expo), once the signer
    // app is in *production* mode, the correct URL can always be used
    const urlPrefix =
      process.env.VUE_APP_SIGNER_ENV === "production"
        ? `dhealth://sign`
        : `dhealth://--/sign`;

    // encoding QR JSON in URL format
    return `${urlPrefix}?payload=${encodeURIComponent(
      this.qrConfig?.toJSON() as string
    )}`;
  }

  /**
   * This method returns current operation system of user
   *
   * @access protected
   * @returns {string}
   */
  public get getMobileOS() {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) {
      return "Android";
    } else if (
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    ) {
      return "iOS";
    }
    return "Other";
  }

  /**
   * This method is called upon *mounting* the component onto a Vue
   * app. For this component, it will populate the {@link authChallenge}
   * property with a valid authentication challenge as requested from
   * the backend API.
   *
   * @access public
   * @async
   * @returns {void}
   */
  public async mounted() {
    this.qrConfig = this.createLoginQRCode();
    this.connectWebsocket();

    // make sure referral code is saved
    if (this.$route.params.refCode) {
      await this.$store.commit("auth/setRefCode", this.$route.params.refCode);
    }

    this.modalTimer = setTimeout(() => {
      this.$root.$emit("modal", {
        overlayColor: "rgba(19, 30, 25, 0.7)",
        type: "notification",
        description: this.$t("login_screen.modal.description"),
        modalBg: "#6EE7EE",
        width: 456,
        illustration: "user-avatar.png",
      });
    }, 8000);
  }

  /**
   * This method is called upon *destroying* the component which happens
   * whenever the component is *not rendered anymore*. For this component,
   * it will clear the created intervals.
   *
   * @access public
   * @async
   * @returns {void}
   */
  public beforeDestroy() {
    this.$root.$emit("modal-close");

    if (this.modalTimer) {
      clearTimeout(this.modalTimer);
    }

    if (this.globalIntervalTimer) {
      clearTimeout(this.globalIntervalTimer);
    }

    if (this.wsConnection) {
      this.wsConnection.close();
    }
  }

  /**
   * This helper method connects the frontend client to the
   * backend runtime *websocket server* for authentication.
   * <br /><br />
   * Note that the protocol `wss://` is used in case of secure
   * backend runtime access (HTTPS).
   *
   * @access protected
   * @returns {WebSocket}
   */
  protected connectWebsocket(): WebSocket {
    // internal configuration object
    const config = {
      https: process.env.VUE_APP_BACKEND_USE_HTTPS === "true",
      host: process.env.VUE_APP_BACKEND_HOST, // contains port
      path: "/ws",
    };
    const scheme = config.https ? "wss" : "ws";

    // note that HTTPS automatically uses WSS
    const websocketUrl = `${scheme}://${config.host}${config.path}`;
    console.log(`Now connecting to websocket with: ${websocketUrl}`);

    // open websocket channel
    this.wsConnection = new WebSocket(websocketUrl);

    // configures connection handler
    this.wsConnection.onopen = function () {
      console.log("Successfully connected to the websocket server...");
    };

    // configures channel messages
    const handler = this.fetchAccessToken;
    this.wsConnection.onmessage = async function (evt: any) {
      console.log("Websocket event caught: ", evt.data);
      if (evt.data === "auth.complete") {
        await handler();
      }
    };

    return this.wsConnection;
  }

  /**
   * This helper method generates a QRCode using `@dhealth/qr-library`.
   * The created QRCode can be scanned with dHealth Mobile Wallet and
   * the upcoming dHealth Signer.
   * <br /><br />
   * Note that by modifying the network type or generation hash passed
   * to the `createTransactionRequest`, it may introduce discovery bugs
   * and affect the executed contract.
   *
   * @access protected
   * @returns {QRCode}
   */
  protected createLoginQRCode(): QRCode | null {
    try {
      return QRCodeGenerator.createTransactionRequest(
        this.transactionRequest,
        NetworkType.MAIN_NET,
        // @todo this should be part of the configuration of ELEVATE
        "ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16"
      );
    } catch (e) {
      return null;
    }
  }

  /**
   * This method creates an interval to query access tokens
   * from the backend API.
   * <br /><br />
   * The default interval length is to execute this process
   * every `15 seconds` (noted in milliseconds: `15000`).
   *
   * @access protected
   * @param   {number}    milliseconds    The number of milliseconds between each execution of the access token loop.
   * @returns {void}
   */
  protected async fetchAccessToken(): Promise<void> {
    try {
      // try authenticating the user and requesting an access token
      // this will only succeed provided that the end-user attached
      // the authentication challenge in a transfer transaction
      const response: AccessTokenDTO | null = await this.$store.dispatch(
        "auth/fetchAccessToken"
      );

      // if we could not fetch an access token, bail out
      if (null === response) {
        throw new Error("Unauthorized");
      }

      // redirects to a protected area and marks successful log-in
      this.$router.push({ name: "app.dashboard" });
    } catch (e) {
      // because dHealth Network data storage is asynchronous, the
      // backend API returns a HTTP401-Unauthorized *until* it can
      // find the authentication challenge inside a transaction.
      console.log(e);
    }
  }
}
