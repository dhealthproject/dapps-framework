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

NOTE: The below `:class` assignations *must* explicitely list the class
names that are used for the component styles. It is not recommended to use
dynamic class names (e.g. `'text-' + $var`) because TailWind would not
be able to optimize the resulting CSS of these classes and would omit
including them in the compiled CSS that is attached with this library.
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
    <div class="dappTitleBar-left"><slot name="left" /></div>
    <div class="dappTitleBar-center"><slot name="center" /></div>
    <div class="dappTitleBar-right"><slot name="right" /></div>
  </div>
</template>

<script lang="ts" src="./DappTitleBar.ts"></script>

<style lang="postcss" scoped>
@import "./DappTitleBar.scss";
</style>
