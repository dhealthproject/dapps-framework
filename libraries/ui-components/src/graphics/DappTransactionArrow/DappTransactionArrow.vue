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
  <svg
    id="arrow"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :x="_x"
    :y="_y"
    width="302px"
    height="27px"
    viewBox="0 0 302 27"
    xml:space="preserve"
  >
    <g v-if="isMobile">
      <line
        class="dappTransactionArrow-arrow-body"
        fill="none"
        stroke-width="5"
        stroke-miterlimit="10"
        x1="39"
        y1="13.5"
        x2="246"
        y2="13.5"
      />
      <polygon
        transform="translate(-40 0)"
        class="dappTransactionArrow-arrow-end"
        points="269.176,22.628 273.267,13 269.176,3.372 292,13"
      />
    </g>
    <g v-else>
      <line
        class="dappTransactionArrow-arrow-body"
        fill="none"
        stroke-width="5"
        stroke-miterlimit="10"
        x1="9"
        y1="13.5"
        x2="276"
        y2="13.5"
      />
      <polygon
        class="dappTransactionArrow-arrow-end"
        points="269.176,22.628 273.267,13 269.176,3.372 292,13"
      />
    </g>
    <foreignObject
      class="dappTransactionArrow-circle-icons-container"
      x="9"
      y="0"
      width="267"
      height="27"
    >
      <slot />
    </foreignObject>
  </svg>
</template>

<script lang="ts" src="./DappTransactionArrow.ts"></script>

<style lang="postcss" scoped>
@import "./DappTransactionArrow.scss";
</style>
