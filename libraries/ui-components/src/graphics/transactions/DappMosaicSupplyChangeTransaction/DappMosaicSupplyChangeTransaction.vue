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
  <div>
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      :width="getPixels(transactionGraphicWidth)"
      :height="getPixels(transactionGraphicHeight)"
      :viewBox="transactionGraphicViewbox"
      xml:space="preserve"
    >
      <DappAccountAvatar
        :x="subjectPositionX"
        :y="subjectPositionY"
        :width="subjectWidth"
        :height="subjectHeight"
        :address="signer"
      />
      <DappMosaicIcon
        :x="objectPositionX"
        :y="objectPositionY"
        :width="subjectWidth"
        :height="subjectHeight"
        :mosaic="mosaic"
      />
      <DappTransactionArrow :x="arrowPositionX" :y="arrowPositionY" />
      <DappEditCircle
        :x="getCircleIconPositionX(0)"
        :y="circleIconPositionY"
        :content="content"
      />
      <text
        :x="transactionTypeTextPositionX"
        :y="transactionTypeTextPositionY"
        text-anchor="middle"
        class="dappMosaicSupplyChangeTransaction-message"
      >
        {{ transactionType }}
        <title>{{ transactionType }}</title>
      </text>
    </svg>
  </div>
</template>

<script lang="ts" src="./DappMosaicSupplyChangeTransaction.ts"></script>

<style lang="postcss" scoped>
@import "./DappMosaicSupplyChangeTransaction.scss";
</style>
