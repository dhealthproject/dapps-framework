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
  <div id="app">
    <div v-if="$route.meta.layout === 'fullscreen'" class="layout-fullscreen">
      <router-view :key="$route.fullPath"></router-view>
    </div>
    <div v-else class="layout-default">
      <header />
      <nav class="block">
        <router-link :to="{ name: 'home' }">Home</router-link> |
        <router-link :to="{ name: 'about' }">About</router-link> |
        <router-link :to="{ name: 'onboarding' }">Onboarding</router-link>
      </nav>

      <div class="block w-screen mx-auto">
        <transition name="view">
          <router-view :key="$route.fullPath"></router-view>
        </transition>
      </div>
      <footer class="fixed bottom-4 right-4">
        <div class="text-xs">v{{ version }}</div>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" src="./App.ts"></script>

<style lang="scss">
@import "./App.scss";
</style>
