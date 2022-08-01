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
    <h2
      class="dapp-screen-legal-disclaimer__title"
      v-html="currentData.title"
    />
    <div class="dapp-screen-legal-disclaimer__consent">
      <p class="dapp-screen-legal-disclaimer__text" v-html="currentData.text" />
      <div class="dapp-screen-legal-disclaimer__confirm">
        <div class="dapp-screen-legal-disclaimer__confirm__checkbox">
          <input type="checkbox" id="accept" />
          <label for="accept" v-html="currentData.consent" />
        </div>
        <DappButton v-html="currentData.button" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./LegalDisclaimer.ts"></script>

<style lang="scss">
@import "./LegalDisclaimer.scss";
</style>
