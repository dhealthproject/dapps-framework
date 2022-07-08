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
  <div class="dappTransactionGraphic-body">
    <div v-if="isAggregate" :class="aggregateContainerClass">
      <div
        v-if="cosigners.length"
        class="dappTransactionGraphic-signers-section-wrapper"
      >
        <div class="dappTransactionGraphic-signers-section">
          <img
            :src="SignatureIcon"
            class="dappTransactionGraphic-signature-icon"
          />
          <svg
            v-for="(address, index) in cosigners"
            :key="'tg-cos' + index"
            class="dappTransactionGraphic-cosigner"
            viewBox="35 35 60 60"
            :width="64"
            :height="64"
          >
            <DappAccountAvatar :width="128" :height="128" :address="address" />
          </svg>
        </div>
      </div>
      <div
        v-for="(innerTransactionData, index) in transaction.innerTransactions"
        :key="'tgw' + index"
        class="dappTransactionGraphic-aggregate-inner"
      >
        <div
          v-if="displayTransactionNumber"
          class="dappTransactionGraphic-aggregate-inner-index"
        >
          {{ index + 1 }}
        </div>
        <DappAbstractTransactionGraphic :transaction="innerTransactionData" />
      </div>
    </div>
    <DappAbstractTransactionGraphic v-else :transaction="transaction" />
  </div>
</template>

<script lang="ts" src="./DappTransactionGraphic.ts"></script>

<style lang="postcss" scoped>
@import "./DappTransactionGraphic.scss";
</style>
