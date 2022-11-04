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
  <div class="referral-input">
    <input :value="transformedValue" :class="`${type}`" type="text" readonly />
    <div @click="copyToClipBoard($event, transformedValue)" class="copy">
      <span :class="`${type}`" class="text" v-html="referralLabel" />
      <img :src="getImageUrl('copy-icon.svg')" alt="Copy referral code" />
    </div>
  </div>
</template>

<script lang="ts" src="./ReferralInput.ts"></script>
