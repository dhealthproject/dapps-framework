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
  <div class="dapp-friends-list">
    <h2 class="title">Your Friends</h2>
    <div
      v-for="(friend, index) in friends"
      :key="index"
      class="dapp-friends-list__item"
    >
      <img :src="getImageUrl(friend.avatar)" :alt="friend.name" />
      <span class="name">{{ friend.name }}</span>
      <DappButton>Go 1-on-1</DappButton>
    </div>
  </div>
</template>

<script lang="ts" src="./FriendsList.ts"></script>

<style lang="scss">
@import "./FriendsList.scss";
</style>
