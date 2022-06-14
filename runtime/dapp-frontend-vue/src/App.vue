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
    <header />
    <nav class="block">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
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
</template>

<script lang="ts" src="./App.ts"></script>

<style lang="scss">
@import "./App.scss";
</style>
