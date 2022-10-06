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
    <LeaderBoardRow :data="getLeaderBoardItems[3]" :current-player="true" />
    <LeaderBoardRow
      v-for="(leader, index) in splicedItems"
      :key="leader.avatar + index"
      :data="leader"
    />

    <!-- Custom LeaderBoardItem item markup usage example -->
    <!-- <LeaderBoardRow :data="getLeaderBoardItems[2]">
      <template v-slot:default="props">
        test v-slot
        {{ props }}
      </template>
    </LeaderBoardRow> -->
  </div>
</template>

<script lang="ts" src="./LeaderBoard.ts"></script>

<style lang="scss">
@import "./LeaderBoard.scss";
</style>
