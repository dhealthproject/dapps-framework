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
      class="dapp-leaderboard-item dapp-leaderboard-item__default flex flex-row items-center justify-between"
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
          :alt="data.userName || data.address"
        />
      </div>
      <div class="dapp-leaderboard-item__user-info">
        <div class="flex flex-row items-center">
          <span class="name" v-html="data.userName || data.address" />
          <DirectionTriangle
            v-if="data.trendline"
            :direction="data.trendline"
          />
        </div>
        <ul v-if="data && data.activities" class="activities">
          <li
            v-for="(activity, index) in data.activities"
            :key="activity + index"
          >
            <img
              :src="getImageUrl(`activities-icons/${activity}.svg`)"
              :alt="activity"
            />
          </li>
        </ul>
      </div>
      <div class="dapp-leaderboard-item__amount text-right">
        <span v-html="`$${data.assets} FIT`" />
      </div>
    </div>
    <div v-else class="dapp-leaderboard-item__custom">
      <!-- USAGE EXAMPLE -->
      <!-- <LeaderBoardItem :data="yourData">
            <template v-slot:default="props"> -- content of the data is scoped to props.itemData
              <h1>{{ props.itemData.title }}</h1>
            </template>
          </LeaderBoardItem> -->
      <slot :itemData="data" />
    </div>
  </div>
</template>

<script lang="ts" src="./LeaderBoardRow.ts"></script>
