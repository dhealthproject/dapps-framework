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
      'dappNavigation-base': true,
      'dappNavigation-style-primary': variant == 'primary',
      'dappNavigation-style-secondary': variant == 'secondary',
      'dappNavigation-style-tertiary': variant == 'tertiary',
    }"
  >
    <DappTitleBar>
      <div slot="left" class="dappNavigation-start">
        <slot name="start" />
      </div>
      <div slot="center" class="dappNavigation-menuItems">
        <div
          v-for="n in Number(noOfMenuItems)"
          :key="'item_' + n"
          class="dappNavigation-menuItem"
        >
          <slot :name="`menuItem${n}`" />
        </div>
      </div>
      <div slot="center" class="dappNavigation-title">
        <DappTitle :text="title" />
      </div>
      <div slot="right" class="dappNavigation-end-sm">
        <slot name="end" />
      </div>
      <svg
        slot="right"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="dappNavigation-end"
      >
        <path
          d="M16 18V20H5V18H16ZM21 11V13H3V11H21ZM19 4V6H8V4H19Z"
          fill="#1D1843"
        />
      </svg>
    </DappTitleBar>
  </div>
</template>

<script lang="ts" src="./DappNavigation.ts"></script>

<style lang="postcss" scoped>
@import "./DappNavigation.scss";
</style>
