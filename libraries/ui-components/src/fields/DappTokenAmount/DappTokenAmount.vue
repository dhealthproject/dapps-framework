<!--
/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth UI Components
 * @subpackage  Components
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
-->
<template>
  <span class="widget-token-amount">
    <span class="text-black-600/100">{{ integerPart }}</span>
    <span
      :class="{
        'text-black-600/100': !!fadeDecimals,
        'text-black-600/75': fadeDecimals,
      }"
      >{{ fractionalPart }}</span
    >

    <span v-if="!!currency && currency.length">&nbsp;{{ currency }}</span>
  </span>
</template>

<script lang="ts" src="./DappTokenAmount.ts"></script>
