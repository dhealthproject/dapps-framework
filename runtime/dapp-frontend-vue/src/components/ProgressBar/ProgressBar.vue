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
  <div class="dapp-progress">
    <div
      v-for="i in steps"
      :key="i"
      class="item"
      :class="{ completed: i <= completedSteps }"
    />
    <img
      v-if="endIcon"
      :src="getImageUrl(endIcon)"
      class="icon end"
      alt="50 friends referred"
    />
  </div>
</template>

<script lang="ts" src="./ProgressBar.ts"></script>
