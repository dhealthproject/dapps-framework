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
    class="dapp-toast flex flex-row justify-between items-center"
    :class="`${config.state}`"
  >
    <div class="flex flex-row justify-between items-center">
      <InlineSvg
        v-if="config.icon"
        :src="getImageUrl(config.icon)"
        class="icon"
        :alt="config.title"
        width="40"
        height="40"
      />
      <div class="dapp-toast-text">
        <h2 v-html="config.title" />
        <p v-html="config.description" />
      </div>
    </div>
    <div>
      <InlineSvg
        :src="getImageUrl('close-icon.svg')"
        alt="close"
        class="close"
        width="20"
        height="20"
        @click="$root.$emit('toast-close')"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./Toast.ts"></script>
