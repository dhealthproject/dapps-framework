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
  <div class="dapp-login-screen bg-[#f5f5f5]">
    <div class="flex flex-row md:flex-column">
      <div class="dapp-login-screen__column hero">
        <ElevateLogo :width="212" />
        <div class="dapp-login-screen__column__carousel">
          <div
            v-for="(item, index) in carouselItems"
            :key="item + index"
            class="carousel-item"
          >
            <h2 v-if="index === selectedIndex" class="carousel-item__title">
              {{ item }}
            </h2>
          </div>
          <div class="carousel-controls">
            <div
              v-for="n in carouselItems.length"
              :key="n"
              :class="{ active: n - 1 === selectedIndex }"
              @click="selectedIndex = n - 1"
              class="carousel-controls__item"
            />
          </div>
        </div>
      </div>
      <div class="dapp-login-screen__column flex flex-column justify-center">
        <DappQR :qrCode="createLoginContract()" />
        <ul class="steps">
          <li v-for="(tutorialItem, index) in tutorialItems" :key="index">
            <span class="number">{{ index + 1 }}</span> {{ tutorialItem }}
          </li>
        </ul>
        <DappButton>Watch a video tutorial</DappButton>
        <footer>
          © {{ new Date().getFullYear() }} dHealth. All Rights Reserved
        </footer>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./LoginScreen.ts"></script>

<style lang="scss" scoped>
@import "./LoginScreen.scss";
</style>
