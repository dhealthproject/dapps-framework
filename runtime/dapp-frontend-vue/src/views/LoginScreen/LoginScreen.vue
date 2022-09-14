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
  <div class="dapp-login-screen bg-[#F3F1EE]">
    <NavPanel class="mobile">
      <template v-slot:nav-left>
        <inline-svg
          :src="getImageUrl('icons/arrow-back.svg')"
          alt="Back"
          @click="$router.go(-1)"
        />
      </template>
      <template v-slot:nav-center>
        <h2 class="dapp-login-screen__title" v-html="'Connect your Wallet'" />
      </template>
    </NavPanel>
    <div class="dapp-login-screen__container">
      <NavPanel class="desktop">
        <template v-slot:nav-left>
          <inline-svg
            :src="getImageUrl('icons/arrow-back.svg')"
            alt="Back"
            class="back"
            @click="$router.go(-1)"
          />
        </template>
        <template v-slot:nav-center>
          <h2 class="title">Connect your Wallet</h2>
        </template>
      </NavPanel>
      <div class="qr-wrapper">
        <DividedScreen :gap="32">
          <template v-slot:left>
            <DappQR :qrCode="createLoginQRCode()" />
          </template>
          <template v-slot:right>
            <span class="qr-wrapper__title">In 4 easy steps...</span>
            <ul class="qr-wrapper__list">
              <li v-for="(item, index) in tutorialItems" :key="index + item.id">
                <span class="number">{{ index + 1 }}</span>
                {{ item.text }}
              </li>
            </ul>
            <span class="tutorial"
              ><a target="_blank" href="#"
                ><img
                  :src="getImageUrl('icons/play-icon.svg')"
                  alt="Need help? Watch a Video Tutorial" /></a
              >Need help? Watch a&nbsp;
              <a target="_blank" href="#">Video Tutorial</a></span
            >
          </template>
        </DividedScreen>
      </div>
      <div class="on-mobile">
        <span class="on-mobile__title">Currently on a mobile device?</span>
        <UiButton :accent="true">Connect with dHealth Wallet</UiButton>
        <p class="on-mobile__link">
          If you’re new to dHealth Network,
          <a target="_blank" href="#">download dHealth Signer App</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./LoginScreen.ts">
import UiButton from "@/components/UiButton/UiButton.vue";
</script>
