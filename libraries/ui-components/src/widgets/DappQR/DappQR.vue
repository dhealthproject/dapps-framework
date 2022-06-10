<!--
/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
-->
<template>
  <div
    :class="{
      base: true,
      'style-primary': variant == 'primary',
      'style-secondary': variant == 'secondary',
      'style-tertiary': variant == 'tertiary',
    }"
  >
    <img
      :src="qrCodeBase64$"
      alt="dHealth Digital Contract QR Code"
      style="height: 200px; margin: auto"
      @click="dumpJSON"
    />

    <slot name="download">
      <DappButton v-if="!!withDownload" variant="secondary">
        <a :href="qrCodeBase64$" :download="downloadName">Download</a>
      </DappButton>
    </slot>
  </div>
</template>

<script lang="ts" src="./DappQR.ts"></script>

<style lang="postcss" scoped>
@import "./DappQR.scss";
</style>
