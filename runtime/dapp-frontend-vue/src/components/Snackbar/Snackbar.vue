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
  <div
    class="dapp-snackbar flex flex-row justify-between items-center"
    :class="`${state}`"
  >
    <div class="flex flex-row justify-between items-center">
      <InlineSvg
        v-if="icon"
        :src="icon"
        class="icon"
        :alt="title"
        width="40"
        height="40"
      />
      <div class="dapp-snackbar-text">
        <h2 v-html="title" />
        <p v-html="description" />
      </div>
    </div>
    <div>
      <InlineSvg
        :src="getImageUrl('close-icon.svg')"
        alt="close"
        class="close"
        width="20"
        height="20"
        @click="$emit('snackbar-close')"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./Snackbar.ts"></script>
