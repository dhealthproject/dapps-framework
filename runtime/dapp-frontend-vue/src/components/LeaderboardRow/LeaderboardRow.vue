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
  <div
    :class="{ 'current-player': currentPlayer }"
    class="dapp-leaderboard-item"
  >
    <div
      v-if="!isCustom"
      class="dapp-leaderboard-item__default flex flex-row items-center justify-between"
    >
      <div class="dapp-leaderboard-item__position">
        <span v-html="'#' + pad(`${data.position}`, 2)" />
      </div>
      <div
        :style="{ 'border-color': data.color }"
        class="dapp-leaderboard-item__avatar"
      >
        <img
          v-if="data && data.avatar"
          :src="getImageUrl(data.avatar)"
          :alt="data.address"
        />
      </div>
      <div class="dapp-leaderboard-item__user-info">
        <div class="flex flex-row items-center">
          <span class="name" v-html="formatAddress(data.address)" />
          <DirectionTriangle
            v-if="data.trendline"
            :direction="data.trendline"
          />
        </div>
        <TopActivities :items="data.activities" />
      </div>
      <div class="dapp-leaderboard-item__amount text-right">
        <span v-html="`${formatAmount(data.amount, 2)} $ACTIV`" />
      </div>
    </div>
    <div v-else class="dapp-leaderboard-item__custom">
      <slot :itemData="data" />
    </div>
  </div>
</template>

<script lang="ts" src="./LeaderboardRow.ts"></script>
