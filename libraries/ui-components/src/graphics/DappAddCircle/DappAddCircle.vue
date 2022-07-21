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
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    :x="_x"
    :y="_y"
    width="38.5px"
    height="38.167px"
    viewBox="0 0 38.5 38.167"
    xml:space="preserve"
    class="dappAddCircle-circle-icon"
  >
    <title>{{ content }}</title>
    <defs>
      <linearGradient
        id="message-circle-gradient"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >
        <stop offset="0%" stop-color="RGB(255, 197, 255)" />
        <stop offset="100%" stop-color="RGB(255, 0, 255)" />
      </linearGradient>
    </defs>
    <circle
      fill-rule="evenodd"
      clip-rule="evenodd"
      fill="url(#message-circle-gradient)"
      cx="19.115"
      cy="19.094"
      r="17.26"
    />
    <g>
      <rect
        x="17"
        y="11"
        fill-rule="evenodd"
        clip-rule="evenodd"
        fill="#FFFFFF"
        width="4"
        height="16"
      />
      <rect
        x="11"
        y="17"
        fill-rule="evenodd"
        clip-rule="evenodd"
        fill="#FFFFFF"
        width="16"
        height="4"
      />
    </g>
    <circle
      :id="id"
      fill-rule="evenodd"
      clip-rule="evenodd"
      fill="transparent"
      cx="19.115"
      cy="19.094"
      r="17.26"
    />
  </svg>
</template>

<script lang="ts" src="./DappAddCircle.ts"></script>
