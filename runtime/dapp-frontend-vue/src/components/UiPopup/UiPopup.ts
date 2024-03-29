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
import InlineSvg from "vue-inline-svg";
import Vue from "vue";
import { mapGetters } from "vuex";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import UiButton from "../UiButton/UiButton.vue";
import ReferralInput from "../ReferralInput/ReferralInput.vue";
import { SocialPlatformDTO } from "../../models/SocialPlatformDTO";

// modal config
export interface ModalConfig {
  keepOnBgClick?: boolean;
  overlayColor?: string;
  modalBg?: string;
  type: "form" | "notification" | "share";
  title?: string;
  width: number;
  fields?: any[];
  submitCallback?: any;
  description?: string;
  illustration?: string;
  shareNetworks?: SocialPlatformDTO[];
}

// styles source
import "./UiPopup.scss";

/*
 * @class UiPopup
 * @description This class implements a Vue component to display
 * a popup with specific configuration
 * `<br /><br />`
 * usage example: `this.$root.$emit('modal', {title: "My awesome popup"})`
 *
 * @since v0.3.0
 */
@Component({
  components: { InlineSvg, UiButton, ReferralInput },
  computed: {
    ...mapGetters({
      refCode: "auth/getRefCode",
      fetchedSocialPlatforms: "app/socialApps",
    }),
  },
})
export default class UiPopup extends MetaView {
  /**
   * This property used for configuring of displayed popup
   *
   * @var {ModalConfig}
   */
  @Prop({ default: () => ({}) }) config?: ModalConfig;
  protected formFields: any = {};

  /**
   * This property maps to the store getter `app/socialApps` and contains
   * values defined with {@link SocialPlatformDTO}.
   * <br /><br />
   * The `!`-operator tells TypeScript that this value is required
   * and the *public* access permits the Vuex Store to mutate this
   * value when it is necessary.
   *
   * @access public
   * @var {SocialPlatformDTO[]}
   */
  public fetchedSocialPlatforms!: SocialPlatformDTO[];

  /**
   * This property represents
   * getRefCode store getter, value of refCode is getting set on mounted() hook into ref property
   *
   * @access public
   * @var {string}
   */
  public refCode?: string;

  /**
   * This property represents full url with referral code
   *
   * @var {string}
   */
  public refUrl = "";

  /**
   * This property represents social items received from the backend where user can share referral code
   *
   * @var {SocialPlatformDTO}
   */
  public socialPlatforms: SocialPlatformDTO[] = [];

  /**
   * This method is used for hiding pop-up
   * on overlay bg click,
   * works only if `keepOnBgClick === false`
   *
   * @access public
   * @returns {void}
   */
  protected handleBgClick() {
    if (!this.config?.keepOnBgClick) {
      this.$root.$emit("modal-close");
    }
  }

  /**
   * Method that sets fields of form fields object by input names
   *
   * @access protected
   * @param event: any
   * @return void
   */
  protected handleInput(event: any) {
    console.log("handleInput");

    const fieldName = event.currentTarget.getAttribute("name");
    Vue.set(this.formFields, fieldName, event.target.value);
  }

  /**
   * Computed returns boolean according to value of all inputs in form
   *
   * @access protected
   * @return boolean
   */
  protected get isFormFilled() {
    return !Object.values(this.formFields).includes("");
  }

  /**
   * This method is available when `config.type === 'form'`
   * used for handling submitting of form
   * gets all inputs values, creates object where key is input name,
   * passes this object to `submitCallback`
   *
   * @access public
   * @returns {void}
   */
  protected handleFormSubmission() {
    const formValues: any = {};

    const inputs = Array.from(document.getElementsByClassName("dynamic-input"));

    inputs.forEach((input) => {
      const inputName = input.getAttribute("name");

      if (inputName) {
        formValues[inputName] = (<HTMLInputElement>input).value;
      }
    });

    if (this.config && this.config.submitCallback) {
      this.config.submitCallback(formValues);
    }
  }

  mounted() {
    // if fields property exists - set all input values to ""
    if (this.config?.fields) {
      this.config.fields.forEach((field) => {
        Vue.set(this.formFields, field.name, "");
      });
    }

    if (this.config?.type === "share" && this.fetchedSocialPlatforms) {
      this.socialPlatforms = this.fetchedSocialPlatforms.map(
        (item: SocialPlatformDTO) => ({
          ...item,
          shareUrl: this.refCode
            ? item.shareUrl.replace("%REFERRAL_CODE%", this.refCode)
            : item.shareUrl.replace("/%REFERRAL_CODE%", ""),
        })
      );
    }
  }
}
