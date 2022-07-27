<!--
/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
-->

<template>
  <div class="dapp-quick-stats">
    <h2 class="title">Quick Stats</h2>
    <div class="quick-stats">
      <div
        v-for="(item, index) in statsConfig"
        :key="index"
        class="quick-stats__item"
      >
        <div class="flex items-center">
          <div class="number">{{ item.amount }}</div>
          <DirectionTriangle :direction="item.direction" />
        </div>
        <div class="title">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./QuickStats.ts"></script>

<style lang="scss">
@import "./QuickStats.scss";
</style>
