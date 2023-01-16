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
  <div class="dapp-rewards-list">
    <h2 class="dapp-rewards-list__title" v-html="title" />
    <div class="flex items-center justify-between mb-[50px]">
      <div>
        <p class="dapp-rewards-list__description" v-html="description" />
      </div>
      <div class="dapp-rewards-list__share" @click="handleShare">
        Share <img :src="getImageUrl('share-rewards.svg')" alt="Share" />
      </div>
    </div>
    <div class="dapp-rewards-list__items">
      <div
        v-for="(medal, index) in medals"
        :key="medal.condition + index"
        :class="{ received: medal.received }"
        class="medal"
        @click="onMedalClick(medal)"
      >
        <div class="medal__content">
          <img :src="getImageUrl(medal.image)" :alt="medal.condition" />
        </div>
        <div class="medal__tip">
          <inline-svg :src="getImageUrl('rewards-tip.svg')" class="triangle" />
          {{ medal.condition }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./RewardsList.ts"></script>
