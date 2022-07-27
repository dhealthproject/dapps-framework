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
  <div class="dapp-tabs">
    <div class="dapp-tabs__buttons">
      <button
        v-for="(tab, index) in tabNames"
        @click="selectedTab = index"
        class="tab"
        :class="{ active: selectedTab === index }"
        :key="index"
      >
        {{ tab }}
      </button>
      <div
        v-for="(tabContentItem, index) in tabList"
        :key="index + tabContentItem"
        class="dapp-tabs__content"
      >
        <slot
          v-if="selectedTab === index"
          name="tabContent"
          :tabData="tabContentItem"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Tabs.ts"></script>

<style lang="scss">
@import "./Tabs.scss";
</style>
