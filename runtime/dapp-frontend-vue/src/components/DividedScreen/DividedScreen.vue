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
  <div class="dapp-divided-screen">
    <div class="dapp-divided-screen__columns">
      <div
        :style="{ paddingRight: `${gap}px`, maxWidth: columnsSize.left }"
        class="dapp-divided-screen__columns__column"
      >
        <slot name="left"></slot>
      </div>
      <div
        :style="{ maxWidth: columnsSize.right }"
        class="dapp-divided-screen__columns__column"
      >
        <slot name="right"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./DividedScreen.ts"></script>
