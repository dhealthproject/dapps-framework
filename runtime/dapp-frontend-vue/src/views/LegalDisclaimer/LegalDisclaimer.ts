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
import InlineSvg from "vue-inline-svg";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import { DappButton } from "@dhealth/components";
import NavPanel from "@/components/NavPanel/NavPanel.vue";
import UiButton from "@/components/UiButton/UiButton.vue";

// style resource
import "./LegalDisclaimer.scss";

/*
 * @class LegalDisclaimer
 * @description This class implements a Vue component to display
 * legal related information
 *
 * @since v0.3.0
 */
@Component({
  components: {
    DappButton,
    NavPanel,
    InlineSvg,
    UiButton,
  },
})
export default class LegalDisclaimer extends MetaView {
  /**
   * Property to display
   * state of the acceptence disclaimer
   *
   * @access public
   * @var {boolean}
   */
  legalAccepted = false;

  /**
   * This computed returns
   * current configuration of the legal page
   * configuration is getting according to route name
   *
   * @access public
   * @returns {any}
   */
  get legalData() {
    const currentKey = this.$route.name?.split(".")[1];
    const currentLegalItem = this.$t(`legal.${currentKey}`);
    if (currentKey && currentLegalItem) {
      return currentLegalItem;
    }

    return this.$t("legal.terms-and-conditions");
  }

  /**
   * This method handles submitting
   * of accepted documents.
   *
   * @access public
   * @returns {void}
   */
  public handleAccept() {
    // temporary storing of accepted Terms and Conditions in localStorage
    // @todo discuss the way of storing accepted Terms and Conditions
    const currentKey = this.$route.name?.split(".")[1];
    localStorage.setItem(
      `${currentKey}_accepted`,
      JSON.stringify(this.legalAccepted)
    );

    this.$router.push({ name: "app.login" });
  }
}
