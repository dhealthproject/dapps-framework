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
    @click="$emit('click')"
    :class="{
      'bg-primary': designVariant.name === 'primary',
      'bg-secondary': designVariant.name === 'secondary',
      'bg-tertiary': designVariant.name === 'tertiary',
      'bg-accentFirst': designVariant.name === 'accentFirst',
      'bg-accentSecond': designVariant.name === 'accentSecond',
      'bg-accentThird': designVariant.name === 'accentThird',
      'bg-accentFourth': designVariant.name === 'accentFourth',
    }"
  >
    <div
      :class="{
        'text-white': designVariant.isDark,
        'text-black': !designVariant.isDark,
      }"
    >
      <slot name="icon" />
      <slot name="prefix" />
      <slot>Click this</slot>
      <slot name="suffix" />
    </div>
  </button>
</template>

<script lang="ts" src="./ActionButton.ts"></script>

<style lang="postcss" scoped>
@import "./ActionButton.scss";
</style>
