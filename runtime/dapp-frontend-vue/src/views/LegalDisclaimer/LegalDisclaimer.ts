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

interface PageData {
  "terms-of-service": object;
  "privacy-policy": object;
  "terms-and-conditions": object;
}

@Component({
  components: {
    DappButton,
    NavPanel,
    InlineSvg,
    UiButton,
  },
})
export default class LegalDisclaimer extends MetaView {
  legalAccepted = false;

  get legalDisclaimerData() {
    return {
      "terms-of-service": {
        title: "Terms of service",
        text: `These Terms of Use (“TOU”) apply to your access and use of Momentive's
        products, services, websites, and apps that you purchase or sign up for on
        Momentive's websites and which are branded as “Momentive”, “SurveyMonkey”,
        “Wufoo” or “GetFeedback” (collectively the “Service(s)”). These TOU do not
        apply to Services which are available solely through our enterprise sales
        channel. <br /><br />
  
        Additional service-specific terms apply to some Services
        (“Service-Specific Terms”). Certain country-specific terms may also apply
        to you if you are located outside the United States (“Country-Specific
        Terms”). We refer to the Service-Specific Terms and Country-Specific Terms
        collectively as “Additional Terms” and the combination of these TOU and
        any applicable Additional Terms collectively as these “Terms.”<br /><br />
  
        You agree to these Terms by clicking to accept these Terms, executing a
        document that references them, or using the Services.<br /><br />
  
        If you will be using the Services on behalf of an organization, you agree
        to these Terms on behalf of that organization and you represent that you
        have the authority to do so. In such case, “you” and “your” will refer to
        that organization. <br /><br />These Terms of Use (“TOU”) apply to your access and use of Momentive's
        products, services, websites, and apps that you purchase or sign up for on
        Momentive's websites and which are branded as “Momentive”, “SurveyMonkey”,
        “Wufoo” or “GetFeedback” (collectively the “Service(s)”). These TOU do not
        apply to Services which are available solely through our enterprise sales
        channel. <br /><br />
  
        Additional service-specific terms apply to some Services
        (“Service-Specific Terms”). Certain country-specific terms may also apply
        to you if you are located outside the United States (“Country-Specific
        Terms”). We refer to the Service-Specific Terms and Country-Specific Terms
        collectively as “Additional Terms” and the combination of these TOU and
        any applicable Additional Terms collectively as these “Terms.”<br /><br />
  
        You agree to these Terms by clicking to accept these Terms, executing a
        document that references them, or using the Services.<br /><br />
  
        If you will be using the Services on behalf of an organization, you agree
        to these Terms on behalf of that organization and you represent that you
        have the authority to do so. In such case, “you” and “your” will refer to
        that organization.`,
        consent: "I confirm that I read and agree the conditions.",
        button: "Accept Terms",
      },
      "privacy-policy": {
        title: "Privacy Policy",
        text: `These Terms of Use (“TOU”) apply to your access and use of Momentive's
        products, services, websites, and apps that you purchase or sign up for on
        Momentive's websites and which are branded as “Momentive”, “SurveyMonkey”,
        “Wufoo” or “GetFeedback” (collectively the “Service(s)”). These TOU do not
        apply to Services which are available solely through our enterprise sales
        channel. <br /><br />
  
        Additional service-specific terms apply to some Services
        (“Service-Specific Terms”). Certain country-specific terms may also apply
        to you if you are located outside the United States (“Country-Specific
        Terms”). We refer to the Service-Specific Terms and Country-Specific Terms
        collectively as “Additional Terms” and the combination of these TOU and
        any applicable Additional Terms collectively as these “Terms.”<br /><br />
  
        You agree to these Terms by clicking to accept these Terms, executing a
        document that references them, or using the Services.<br /><br />
  
        If you will be using the Services on behalf of an organization, you agree
        to these Terms on behalf of that organization and you represent that you
        have the authority to do so. In such case, “you” and “your” will refer to
        that organization.`,
        consent: "I confirm that I read and agree privacy policy.",
        button: "Accept Privacy Policy",
      },
      "terms-and-conditions": {
        title: "Terms & Conditions",
        text: `These Terms of Use (“TOU”) apply to your access and use of Momentive's
        products, services, websites, and apps that you purchase or sign up for on
        Momentive's websites and which are branded as “Momentive”, “SurveyMonkey”,
        “Wufoo” or “GetFeedback” (collectively the “Service(s)”). These TOU do not
        apply to Services which are available solely through our enterprise sales
        channel. <br /><br />
  
        Additional service-specific terms apply to some Services
        (“Service-Specific Terms”). Certain country-specific terms may also apply
        to you if you are located outside the United States (“Country-Specific
        Terms”). We refer to the Service-Specific Terms and Country-Specific Terms
        collectively as “Additional Terms” and the combination of these TOU and
        any applicable Additional Terms collectively as these “Terms.”<br /><br />
  
        You agree to these Terms by clicking to accept these Terms, executing a
        document that references them, or using the Services.<br /><br />
  
        If you will be using the Services on behalf of an organization, you agree
        to these Terms on behalf of that organization and you represent that you
        have the authority to do so. In such case, “you” and “your” will refer to
        that organization.`,
        consent: "I confirm that I read and agree terms & conditions.",
        button: "Accept Terms & Conditions",
      },
    };
  }

  get currentData() {
    const currentKey = this.$route.name?.split(".")[1];
    if (currentKey) {
      const result = this.legalDisclaimerData[currentKey as keyof PageData];
      return result;
    }

    return this.legalDisclaimerData["terms-of-service"];
  }
}
