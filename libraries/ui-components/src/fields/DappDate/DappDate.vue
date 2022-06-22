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
  <div class="date-container">
    <span :title="utcDate(timestamp)">{{ utcDate(timestamp) }}</span>

    <span v-if="isShowTimestamp" class="dapp-date-style-timestamp">{{
      timestamp
    }}</span>
  </div>
</template>

<script lang="ts" src="./DappDate.ts"></script>

<style lang="postcss" scoped>
@import "./DappDate.scss";
</style>
