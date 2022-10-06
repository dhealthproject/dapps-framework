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
    <div
      :class="{
        flex: spacedTitle,
        'justify-between': spacedTitle,
        'items-center': spacedTitle,
      }"
      class="dapp-tabs__buttons"
    >
      <h2 v-if="title" class="dapp-tabs__title" v-html="title" />
      <div class="inner">
        <button
          v-for="(tab, index) in tabNames"
          @click="handleSwitch($event, tabList[index], index)"
          class="tab"
          :class="{ active: selectedTab === index }"
          :key="index"
        >
          {{ tab }}
        </button>
      </div>
      <div v-if="!asSwitcher" class="content-wrapper">
        <div
          v-for="(tabContentItem, index) in tabList"
          :key="index + tabContentItem"
          class="dapp-tabs__content"
        >
          <!-- Pass in this slot markup, which will represent tab content -->

          <!-- USAGE EXAMPLE -->
          <!-- <Tabs :tab-list="tabs">
                <template v-slot:tabContent="props"> -- content of the current tab(tabList[index]) is scoped to tabContentProp
                </template>
              </Tabs> -->
          <slot
            v-if="selectedTab === index"
            name="tabContent"
            :tabData="tabContentItem"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Tabs.ts"></script>
