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
  <div class="dapp-logo inline-block">
    <router-link :to="{ name: 'app.home' }">
      <inline-svg
        :src="getImageUrl('ELEVATE.svg')"
        :class="theme"
        :width="width"
        class="dapp-logo__image"
      />
    </router-link>
  </div>
</template>

<script lang="ts" src="./ElevateLogo.ts"></script>
