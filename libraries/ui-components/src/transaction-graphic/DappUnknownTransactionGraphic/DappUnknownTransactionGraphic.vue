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
  <li class="dappUnknownTransactionGraphic-item">
    <div class="dappUnknownTransactionGraphic-non-overflown" @click="toggle">
      <span
        :class="{
          'dappUnknownTransactionGraphic-field-name': true,
          'dappUnknownTransactionGraphic-bold': isExpandable,
        }"
      >
        {{ isExpandable ? name : `${name}:` }}
      </span>
      <span v-if="!isExpandable" :title="formatItem">
        {{ formatItem }}
      </span>
      <span
        v-if="isExpandable"
        class="dappUnknownTransactionGraphic-field-name dappUnknownTransactionGraphic-bold"
        >[{{ isOpen ? "-" : "+" }}]</span
      >
    </div>
    <ul v-show="isOpen" v-if="isExpandable">
      <DappUnknownTransactionGraphic
        v-for="(key, index) in Object.keys(item)"
        :key="index"
        :item="item[key]"
        :name="key"
      />
    </ul>
  </li>
</template>

<script lang="ts" src="./DappUnknownTransactionGraphic.ts"></script>

<style lang="postcss" scoped>
@import "./DappUnknownTransactionGraphic.scss";
</style>
