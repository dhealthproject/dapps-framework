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
  <div class="dapp-user-balance">
    <inline-svg
      :src="getImageUrl('icons/coins.svg')"
      :class="'dapp-user-balance__icon'"
      :width="16"
      class="dapp-logo__image"
    />
    <!-- @todo: 2 should be replaced with value from config -->
    {{ formatAmount(userBalance, 2) }} $FIT
  </div>
</template>

<script lang="ts" src="./UserBalance.ts"></script>
