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
    <div v-if="getLeaderboardItems.length">
      <LeaderboardRow :data="currentUserItem" :current-player="true" />
      <LeaderboardRow
        v-for="(leader, index) in splicedItems"
        :key="leader.avatar + index"
        :data="leader"
      />
    </div>

    <div v-else class="no-items flex items-center justify-center">
      <p>Failed to load items</p>
    </div>
  </div>

  <!-- Custom LeaderboardItem item markup usage example -->
  <!-- <LeaderboardRow :data="getLeaderboardItems[2]">
      <template v-slot:default="props">
        test v-slot
        {{ props }}
      </template>
    </LeaderboardRow> -->
</template>

<script lang="ts" src="./Leaderboard.ts"></script>

<style lang="scss">
@import "./Leaderboard.scss";
</style>
