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
  <div class="dapp-info-tip">
    <inline-svg
      :src="getImageUrl(icon)"
      :width="iconWidth"
      class="dapp-info-tip__icon"
      @mouseenter="tooltipPosition"
      @mouseleave="tipPosition = ''"
    />
    <div :class="`${tipPosition}`" id="tooltip" class="dapp-info-tip__box">
      <inline-svg
        :class="`${tipPosition}`"
        :src="getImageUrl('tip-arrow.svg')"
        class="dapp-info-tip__box__triangle"
      />
      <h4 v-if="title" class="title" v-html="title" />
      <p v-if="text" class="text" v-html="text" />
    </div>
  </div>
</template>

<script lang="ts" src="./InfoTip.ts"></script>
