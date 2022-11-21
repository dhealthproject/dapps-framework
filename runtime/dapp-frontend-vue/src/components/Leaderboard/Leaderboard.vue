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
    <div v-if="leaderboardItems && leaderboardItems.length > 0">
      <LeaderboardRow :data="currentUserItem" :current-player="true" />
      <LeaderboardRow
        v-for="(leader, index) in splicedItems"
        :key="leader.address + index"
        :data="leader"
      />
    </div>

    <div v-else class="no-items flex items-center justify-center">
      <p v-html="$t('dashboard.leaderboard_no_items')" />
    </div>
  </div>
</template>

<script lang="ts" src="./Leaderboard.ts"></script>

<style lang="scss">
@import "./Leaderboard.scss";
</style>
