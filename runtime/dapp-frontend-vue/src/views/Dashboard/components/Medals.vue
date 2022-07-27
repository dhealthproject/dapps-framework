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
  <div class="dapp-medals">
    <h2 class="title">Your Medals</h2>
    <img
      v-for="(medal, index) in medalsList"
      :key="index"
      :src="getImageUrl(medal)"
      alt="Medal 1"
    />
  </div>
</template>

<script lang="ts" src="./Medals.ts"></script>

<style lang="scss">
@import "./Medals.scss";
</style>
