<!--
/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
-->
<template>
  <div class="dapp-screen-legal-disclaimer">
    <NavPanel class="mobile">
      <template v-slot:nav-left>
        <inline-svg
          :src="getImageUrl('icons/arrow-back.svg')"
          alt="Back"
          @click="$router.go(-1)"
        />
      </template>
      <template v-slot:nav-center>
        <h2
          class="dapp-screen-legal-disclaimer__title"
          v-html="legalData.title"
        />
      </template>
    </NavPanel>

    <div class="dapp-screen-legal-disclaimer__consent">
      <NavPanel class="desktop">
        <template v-slot:nav-left>
          <inline-svg
            :src="getImageUrl('icons/arrow-back.svg')"
            alt="Back"
            @click="$router.go(-1)"
          />
        </template>
        <template v-slot:nav-center>
          <h2
            class="dapp-screen-legal-disclaimer__title"
            v-html="legalData.title"
          />
        </template>
      </NavPanel>
      <div class="dapp-screen-legal-disclaimer__confirm">
        <div class="dapp-screen-legal-disclaimer__confirm__checkbox">
          <p
            class="dapp-screen-legal-disclaimer__text"
            v-html="legalData.main_text"
          />
          <div class="consent-wrapper flex items-center justify-center">
            <input v-model="legalAccepted" type="checkbox" id="accept" />
            <label for="accept" v-html="legalData.consent" />
          </div>
        </div>
      </div>
      <UiButton :disabled="!legalAccepted" @click="handleAccept">{{
        legalData.button
      }}</UiButton>
    </div>
  </div>
</template>

<script lang="ts" src="./LegalDisclaimer.ts"></script>
