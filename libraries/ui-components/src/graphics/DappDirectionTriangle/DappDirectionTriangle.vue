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
      'dappDirectionTriangle-base': true,
      'dappDirectionTriangle-style-primary': variant === 'primary',
      'dappDirectionTriangle-style-secondary': variant === 'secondary',
      'dappDirectionTriangle-style-tertiary': variant === 'tertiary',
    }"
  >
    <div
      v-if="direction === 'both' || direction === 'up'"
      class="dappDirectionTriangle-up"
    />
    <div
      v-if="direction === 'both' || direction === 'down'"
      class="dappDirectionTriangle-down"
    />
  </div>
</template>

<script lang="ts" src="./DappDirectionTriangle.ts"></script>

<style lang="postcss" scoped>
@import "./DappDirectionTriangle.scss";
</style>
