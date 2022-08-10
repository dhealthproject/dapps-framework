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
  <div
    :class="{
      'dappTitleBar-base': true,
      'dappTitleBar-style-primary': variant == 'primary',
      'dappTitleBar-style-secondary': variant == 'secondary',
      'dappTitleBar-style-tertiary': variant == 'tertiary',
    }"
  >
    <div v-if="!hasRightButtonSlot" class="dappTitleBar-leftDiv">
      <slot name="leftIcon" />
    </div>
    <div class="dappTitleBar-centerDiv">
      <slot name="prefix" />
      <div class="dappTitleBar-titleDiv">
        <DappTitle :text="title" />
      </div>
      <slot name="suffix" />
    </div>
    <div v-if="!hasRightButtonSlot" class="dappTitleBar-rightDiv">
      <slot name="rightIcon" />
    </div>
    <div v-else class="dappTitleBar-rightButtonDiv">
      <slot name="rightButton" />
    </div>
  </div>
</template>

<script lang="ts" src="./DappTitleBar.ts"></script>

<style lang="postcss" scoped>
@import "./DappTitleBar.scss";
</style>
