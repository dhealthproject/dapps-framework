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
  <div>
    <div v-if="isPlainMessage">
      {{ message }}
    </div>

    <div v-else @click="expanding">
      <div
        class="dapp-message-style-overlay"
        :class="{ 'dapp-message-style-hideContent': isClick }"
      >
        {{ title }}
      </div>

      <div :class="{ 'dapp-message-style-hideContent': !isClick }">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./DappMessage.ts"></script>

<style lang="postcss" scoped>
@import "./DappMessage.scss";
</style>
