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
names that are used for the button styles. It is not recommended to use
dynamic class names (e.g. `'text-' + $var`) because TailWind would not
be able to optimize the resulting CSS of these classes and would omit
including them in the compiled CSS that is attached with this library.
-->
<template>
  <button
    :class="{
      base: true,
      'style-primary': variant == 'primary',
      'style-secondary': variant == 'secondary',
      'style-tertiary': variant == 'tertiary',
    }"
    @click="handleClick"
  >
    <slot name="icon" />
    <slot name="prefix" />
    <slot>Click this</slot>
    <slot name="suffix" />
  </button>
</template>

<script lang="ts" src="./DappButton.ts"></script>

<style lang="postcss" scoped>
@import "./DappButton.scss";
</style>
