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
    class="rounded py-3 px-4 text-base cursor-pointer font-semibold"
    :class="{
      'bg-primary hover:bg-primaryHover': designVariant.name === 'primary',
      'bg-secondary hover:bg-secondaryHover':
        designVariant.name === 'secondary',
      'bg-tertiary hover:bg-tertiaryHover': designVariant.name === 'tertiary',
      'bg-accentFirst hover:bg-accentFirstHover':
        designVariant.name === 'accentFirst',
      'bg-accentSecond hover:bg-accentSecondHover':
        designVariant.name === 'accentSecond',
      'bg-accentThird hover:bg-accentThirdHover':
        designVariant.name === 'accentThird',
      'bg-accentFourth hover:bg-accentFourthHover':
        designVariant.name === 'accentFourth',
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
border: 1px solid #5D64FF; box-shadow: 0px 0px 5px #5D64FF;
<script lang="ts" src="./ActionButton.ts"></script>

<style lang="postcss" scoped>
@import "./ActionButton.scss";
</style>
