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
  <div class="dappInput-mainDiv">
    <div class="dappInput-inputDiv">
      <DappIcon
        v-if="leftIconSrc"
        class="dappInput-icon-left"
        :src="leftIconSrc"
      />
      <input
        v-model="inputValue"
        class="dappInput-input"
        :placeholder="placeholder"
        :disabled="disabled"
      />
      <DappIcon
        v-if="rightIconSrc"
        class="dappInput-icon-right"
        :src="rightIconSrc"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./DappInput.ts"></script>

<style lang="postcss" scoped>
@import "./DappInput.scss";
</style>
