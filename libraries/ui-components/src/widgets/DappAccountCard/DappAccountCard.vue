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
  <div class="dapp-account-card-body-wrapper">
    <div class="dapp-account-card-body">
      <div class="dapp-account-card-section">
        <svg
          v-if="!disableAvatar && ((inline && !disableAddress) || !inline)"
          class="dapp-account-card-account-icon"
          viewBox="15 15 115 115"
          :width="55"
          :height="55"
        >
          <DappAccountAvatar
            :width="128"
            :height="128"
            :address="address"
            hide-caption
          />
        </svg>
        <div v-if="!disableAddress">
          <div class="dapp-account-card-address">
            <div class="dapp-account-card-sub-address">
              {{ address }}
              <img
                :src="IconCopy"
                class="dapp-account-card-icon-copy dapp-account-card-noselect"
                @click="onCopyClick"
              />
            </div>
            <div>{{ alias }}</div>
          </div>
        </div>
      </div>
      <div v-if="!inline" class="dapp-account-card-mosaic">
        {{ mosaicName }}
      </div>
      <div class="inline-amount">
        <svg
          v-if="!disableAvatar && inline && disableAddress"
          class="dapp-account-card-account-icon"
          viewBox="15 15 115 115"
          :width="55"
          :height="55"
        >
          <DappAccountAvatar
            :width="128"
            :height="128"
            :address="address"
            hide-caption
          />
        </svg>
        <DappTokenAmount
          class="dapp-account-card-balance"
          :value="balance"
          fade-decimals="true"
          :currency="inline ? mosaicName : null"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./DappAccountCard.ts"></script>

<style lang="postcss" scoped>
@import "./DappAccountCard.scss";
</style>
