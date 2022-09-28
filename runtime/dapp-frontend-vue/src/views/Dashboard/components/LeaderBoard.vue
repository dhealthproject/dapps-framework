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
  <div class="dapp-leaderboard-table">
    <div
      v-for="(item, index) in getLeaderBoardItems"
      class="board-item"
      :key="index"
    >
      <div class="board-item__left">
        <span class="number">#{{ item.position }}</span>
        <div class="avatar">
          <img
            v-if="item.avatar"
            :src="getImageUrl(item.avatar)"
            :alt="item.address"
          />
          <div
            v-else-if="items.color"
            class="colored-avatar"
            :style="{ 'background-color': items.color }"
          />
        </div>
        <div class="text-data">
          <div>
            <span class="nickname">{{ items[index].nickname }}</span>
            <DirectionTriangle :direction="item.trendline" />
          </div>
          <span class="hash">{{ item.address }}</span>
        </div>
      </div>
      <div class="board-item__right">{{ item.assets }} $FIT</div>
    </div>
  </div>
</template>

<script lang="ts" src="./LeaderBoard.ts"></script>

<style lang="scss">
@import "./LeaderBoard.scss";
</style>
