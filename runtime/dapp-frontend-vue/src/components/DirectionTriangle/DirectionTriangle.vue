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
  <div class="dapp-triangle">
    <div
      v-if="direction !== 'both'"
      :class="{
        up: direction === 'up',
        down: direction === 'down',
      }"
      class="triangle"
    />
    <div class="both" v-else>
      <div class="triangle up"></div>
      <div class="triangle down"></div>
    </div>
  </div>
</template>

<script lang="ts" src="./DirectionTriangle.ts"></script>

<style lang="scss">
@import "./DirectionTriangle.scss";
</style>
