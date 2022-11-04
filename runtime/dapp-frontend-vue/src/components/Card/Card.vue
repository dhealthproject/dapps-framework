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
  <div class="dapp-card">
    <div v-if="title" class="dapp-card__header">
      <span class="dapp-card__title" v-html="title" />
      <slot name="button" />
    </div>
    <div :class="{ 'no-borders': !showBorders, 'dapp-card__inner': title }">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts" src="./Card.ts"></script>
