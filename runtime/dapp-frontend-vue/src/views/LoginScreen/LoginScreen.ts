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
import { Auth as AuthContract } from "@dhealth/contracts";
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
import { AccessTokenDTO, AuthService } from "@/services/AuthService";
import NavPanel from "@/components/NavPanel/NavPanel.vue";
import UiButton from "@/components/UiButton/UiButton.vue";

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
  },
  computed: {
    ...mapGetters({
      isAuthenticated: "auth/isAuthenticated",
      authChallenge: "auth/getChallenge",
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
   * Whether the QRCode has been fully prepared and loaded or not.
   *
   * @access protected
   * @var {boolean}
   */
  protected hasLoaded = false;

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
   * This *computed* property is used internally to configure
   * the *carousel* component that is displayed on the left
   * of the screen.
   *
   * @access protected
   * @returns {CarouselItem[]}
   */
  protected get carouselItems(): CarouselItem[] {
    return [
      {
        id: "screen_1",
        text: "Keep a digital wardrobe of your gear as an NFT",
      },
      { id: "screen_2", text: "Open dHealth Signer app on your phone" },
      { id: "screen_3", text: "Tap on scan from the bottom navigation bar" },
    ];
  }

  /**
   * This *computed* property is used internally to configure
   * the *tutorial* steps that are displayed on the right
   * of the screen (Steps to use a QRCode).
   *
   * @access protected
   * @returns {TutorialStepItem[]}
   */
  protected get tutorialItems(): TutorialStepItem[] {
    return [
      { id: "tutorial_1", text: "Open dHealth Signer app on your phone" },
      { id: "tutorial_2", text: "Tap on scan from the bottom navigation bar" },
      {
        id: "tutorial_3",
        text: "Point your phone to the screen to capture the code",
      },
    ];
  }

  /**
   * This *computed* property is used internally to determine
   * whether the component should in "loading"-state or not.
   *
   * @access protected
   * @returns {boolean}
   */
  protected get isLoading(): boolean {
    return !this.hasLoaded;
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
    // when we have a challenge, we can create the QR Code.
    return new AuthContract({
      dappIdentifier: "elevate",
      challenge: this.authChallenge,
    }).toJSON();
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
      Address.createFromRawAddress(AuthService.authRegistry),
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
    // do we already have an access token? then redirect
    if (this.isAuthenticated) {
      return this.$router.push({ name: "app.dashboard" });
    }

    try {
      // @todo make sure referral code is saved
      if (this.$route.params.refCode) {
        // const refCode: string = this.$route.params.refCode;
        // Cookies.set("ELEVATE:referralCode", refCode, {
        //   secure: false,
        //   sameSite: "strict",
        //   domain: process.env.VUE_APP_FRONTEND_DOMAIN,
        // });
        // @todo the frontend must not set cookies, should be in backend
      }

      // now start requesting for an access token and refresh token
      // this backend API call will only succeed after the end-user
      // successfully attached the challenge inside a transaction.
      this.fetchAccessToken();
    } catch (err) {
      // @todo error handling here, stop loading state and display error
      console.error(err);
    } finally {
      this.hasLoaded = true;
    }
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
  public beforeDestroyed() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.globalIntervalTimer) {
      clearTimeout(this.globalIntervalTimer);
    }
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
   * This helper method runs the actual *authentication process* in
   * that it requests a valid *accessToken* from the backend API.
   * <br /><br />
   * After receiving an access token (and possibly a refresh token),
   * we store the access token in a *cookie* and redirect the user
   * to the protected area (`/dashboard`).
   * <br /><br />
   * Note that before calling this method, the {@link authChallenge}
   * property must be populated with a valid authentication challenge.
   *
   * @access protected
   * @returns {void}
   */
  protected fetchAccessToken(): void {
    // we use an interval here because the backend API only returns
    // a HTTP200-Success response when the challenge has been found
    // inside a transfer transaction on dHealth Network
    this.createAccessTokenLoop(15 * 1000);

    // this interval is used to *clear memory* in the browser and to
    // avoid that requesting access tokens continues *forever* at the
    // same pace (every 15 seconds). after 5 minutes of requesting access
    // tokens, we assume that the user may need more time to perform
    // authentication and will only request access tokens every minute
    // starting from here.
    this.globalIntervalTimer = setTimeout(() => {
      this.createAccessTokenLoop(60 * 1000);
    }, 5 * 60 * 1000);

    // after 30 minutes of idle screen without being able to request
    // a valid access token, we stop requesting for them completely.
    setTimeout(() => {
      if (undefined !== this.interval) {
        clearInterval(this.interval);
      }

      // @todo may want to refresh?
    }, 30 * 60 * 1000);
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
  protected createAccessTokenLoop(milliseconds: number = 15 * 1000): void {
    this.interval = setInterval(async () => {
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

        // store the access token inside a browser cookie such that
        // it gets attached to future requests to the backend API
        //AuthService.setAccessToken(response.accessToken, response.refreshToken);

        // no need to further try authentication, done here.
        if (undefined !== this.interval) {
          clearInterval(this.interval);
        }

        // redirects to a protected area and marks successful log-in
        this.$router.push({ name: "app.dashboard" });
      } catch (e) {
        // because dHealth Network data storage is asynchronous, the
        // backend API returns a HTTP401-Unauthorized *until* it can
        // find the authentication challenge inside a transaction.
        return;
      }
    }, milliseconds);
  }
}
