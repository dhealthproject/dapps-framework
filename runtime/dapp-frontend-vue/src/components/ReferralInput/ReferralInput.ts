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
import { Prop } from "vue-property-decorator";

// internal dependencies
import { MetaView } from "@/views/MetaView";

// styles source
import "./ReferralInput.scss";

/**
 * @class ReferralInput
 * @description Referral input which is responsible for holding "copieble" value
 *
 * @since v0.3.0
 */
@Component({})
export default class ReferralInput extends MetaView {
  /**
   * This prop represents value displayed in input
   *
   * @var {string}
   */
  @Prop({ default: "", required: true }) val?: string;

  /**
   * This prop represents value displayed in input
   * defaults to "default"
   *
   * @var {"default" | "link"}
   */
  @Prop({ default: "default" }) type?: "default" | "link";

  /**
   * This prop represents value displayed in input
   *
   * @var {string}
   */
  public referralLabel = "Copy referral code";

  /**
   * This property is used to store a pointer to the timeout
   * that calls "Copy referral code" label
   *
   * @access public
   * @var {any}
   */
  protected copyTimer?: any;

  /**
   * This property represents
   * getRefCode store getter, value of refCode is getting set on mounted() hook into ref property
   *
   * @access public
   * @var {string}
   */
  public refCode?: string;

  protected get transformedValue() {
    return this.type === "link"
      ? `${process.env.VUE_APP_FRONTEND_URL}/${this.val}`
      : this.val;
  }

  /**
   * Method allows to copy refCode to user's clipboard
   *
   * @access public
   * @param evt: any
   * @param val: string
   * @returns {void}
   */
  copyToClipBoard(evt: any, val: string) {
    if (undefined !== this.copyTimer) {
      clearTimeout(this.copyTimer);
    }

    navigator.clipboard.writeText(val).then(() => {
      console.log("copied", this.val);
      this.referralLabel = this.$t("common.copied");

      this.copyTimer = setTimeout(() => {
        this.referralLabel = this.$t("dashboard.copy_referral_code");
      }, 2000);
    });
  }
}
