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
    <Tabs
      :tab-list="leaderBoardTabs"
      :as-switcher="true"
      :spaced-title="true"
      title="Leaderboard"
      @tabChange="onTabChange"
    />
    <div v-if="getLeaderBoardItems.length">
      <LeaderBoardRow :data="currentUserItem" :current-player="true" />
      <LeaderBoardRow
        v-for="(leader, index) in splicedItems"
        :key="leader.avatar + index"
        :data="leader"
      />
    </div>

    <div v-else class="no-items flex items-center justify-center">
      <p>Failed to load items</p>
    </div>
  </div>

  <!-- Custom LeaderBoardItem item markup usage example -->
  <!-- <LeaderBoardRow :data="getLeaderBoardItems[2]">
      <template v-slot:default="props">
        test v-slot
        {{ props }}
      </template>
    </LeaderBoardRow> -->
</template>

<script lang="ts" src="./LeaderBoard.ts"></script>

<style lang="scss">
@import "./LeaderBoard.scss";
</style>
