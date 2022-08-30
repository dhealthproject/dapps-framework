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
  <div class="list">
    <div class="dapp-list">
      <h2 class="title">{{ title }}</h2>
      <div
        v-if="hasCustomSlot"
        class="dapp-list__custom flex flex-row justify-between"
      >
        <div
          v-for="(item, index) in items"
          :key="index"
          class="dapp-list__custom__item"
        >
          <slot name="itemContent" :itemData="item" />
        </div>
      </div>
      <!-- If no custom slot provided - display default list -->
      <div v-else class="dapp-list__default">
        <div
          v-for="(item, index) in items"
          :key="index + item.title"
          class="dapp-friends-list__item"
        >
          <img :src="getImageUrl(item.avatar)" :alt="item.title" />
          <span class="name">{{ item.name }}</span>
          <DappButton v-if="item.cta" @click="$emit('cta-click', item)">{{
            item.cta
          }}</DappButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./GenericList.ts"></script>
