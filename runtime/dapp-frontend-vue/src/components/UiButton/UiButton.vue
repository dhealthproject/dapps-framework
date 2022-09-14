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
  <div class="dapp-ui-button">
    <button
      v-if="!to"
      :class="{ disabled: disabled, accent: accent, 'no-borders': type }"
      :disabled="disabled"
      class="dapp-ui-button__component"
      @click="onClick"
    >
      <slot />
    </button>
    <router-link v-else :to="to" v-slot="{ navigate }">
      <button
        @click="navigate"
        :disabled="disabled"
        :class="{ disabled: disabled, accent: accent, 'no-borders': type }"
        class="dapp-ui-button__link"
      >
        <slot />
      </button>
    </router-link>
  </div>
</template>

<script lang="ts" src="./UiButton.ts"></script>
