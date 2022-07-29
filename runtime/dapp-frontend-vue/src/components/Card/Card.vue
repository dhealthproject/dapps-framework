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
    <div class="dapp-card__header flex flex-row justify-between">
      <span class="dapp-card__title" v-html="title" />
      <slot name="button" />
    </div>
    <div class="dapp-card__inner">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts" src="./Card.ts"></script>
