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
          :alt="$t('common.back')"
          @click="$router.go(-1)"
        />
      </template>
      <template v-slot:nav-center>
        <h2
          class="dapp-login-screen__title"
          v-html="$t('login_screen.connect_wallet')"
        />
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
          <h2 class="title" v-html="$t('login_screen.connect_wallet')" />
        </template>
      </NavPanel>
      <div class="qr-wrapper">
        <DividedScreen :gap="32">
          <template v-slot:left>
            <DappQR v-if="qrConfig" :qrCode="qrConfig" class="qr-code" />
            <Loader v-else />
          </template>
          <template v-slot:right>
            <span
              class="qr-wrapper__title"
              v-html="$t('login_screen.in_four_steps')"
            />
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
                  :alt="$t('login_screen.tip')" /></a
              >{{ $t("login_screen.tip_split[0]") }}&nbsp;
              <a
                target="_blank"
                href="#"
                v-html="$t('login_screen.tip_split[1]')"
            /></span>
          </template>
        </DividedScreen>
      </div>
      <div class="on-mobile">
        <!-- <span class="on-mobile__title">Currently on a mobile device?</span>
        <UiButton :accent="true">Connect with dHealth Wallet</UiButton> -->
        <p class="on-mobile__link">
          {{ $t("login_screen.on_mobile_tip[0]") }}
          <a
            target="_blank"
            href="#"
            v-html="$t('login_screen.on_mobile_tip[1]')"
          />
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./LoginScreen.ts"></script>
