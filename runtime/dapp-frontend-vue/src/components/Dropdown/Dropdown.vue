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
  <div class="dapp-dropdown">
    <div class="dapp-dropdown__default" @click="isOpen = !isOpen">
      <img
        :src="getImageUrl('avatar-blank.svg')"
        alt="User Avatar"
        class="dapp-dropdown__default__avatar"
      />
      <img
        :src="getImageUrl('angle-down.svg')"
        alt=""
        class="dapp-dropdown__default__angle"
      />
    </div>

    <transition name="fade">
      <div v-if="isOpen" class="dapp-dropdown__actions">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="action"
          @click="handleItemClick($event, item.action)"
        >
          <img :src="getImageUrl(item.icon)" :alt="item.text" />
          {{ item.text }}
        </div>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" src="./Dropdown.ts"></script>
