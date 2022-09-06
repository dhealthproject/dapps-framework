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
      'dappAccountDetails-base': true,
      'dappAccountDetails-style-primary': variant == 'primary',
      'dappAccountDetails-style-secondary': variant == 'secondary',
      'dappAccountDetails-style-tertiary': variant == 'tertiary',
    }"
  >
    <div class="dappAccountDetails-col-details">
      <slot name="count" />
      <slot name="icon" />
      <slot name="information">
        <div class="dappAccountDetails-information">
          <div class="dappAccountDetails-accountName">
            <span>{{ accountName }}</span>
            <DappDirectionTriangle :direction="direction" />
          </div>
          <span
            class="dappAccountDetails-accountAddress"
            :title="accountInfo.address.pretty()"
          >
            <em>{{ accountInfo.address.pretty() }}</em>
          </span>
        </div>
      </slot>
    </div>
    <div class="dappAccountDetails-col-amount">
      <slot name="value">
        <div class="dappAccountDetails-value">
          <span>{{ amount }} {{ asset.label }}</span>
        </div>
      </slot>
    </div>
    <div v-if="!!$slots.actions" class="dappAccountDetails-col-actions">
      <slot name="actions" />
    </div>
  </div>
</template>

<script lang="ts" src="./DappAccountDetails.ts"></script>

<style lang="postcss" scoped>
@import "./DappAccountDetails.scss";
</style>
