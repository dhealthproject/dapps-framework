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
    <component
      :is="graphicComponent"
      v-if="graphicComponent != 'unknown'"
      :transaction="transaction"
    />
    <div v-else class="dappAbstractTransactionGraphic-unknown-tx-view">
      <DappUnknownTransactionGraphic
        :key="index"
        :item="transaction"
        name="transaction"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./DappAbstractTransactionGraphic.ts"></script>

<style lang="postcss" scoped>
@import "./DappAbstractTransactionGraphic.scss";
</style>
