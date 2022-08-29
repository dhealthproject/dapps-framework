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
  <div class="dapp-screen-header flex row items-center container">
    <div v-if="hasBackButton" class="dapp-screen-header__back-button">
      <slot name="back-button" />
    </div>
    <div class="logo py-10 font-bold text-2xl lg-max:hidden">
      <ElevateLogo :width="167" theme="dark" />
      <!-- <ElevateLogo :width="122" theme="dark" class="lg-max:block" /> -->
    </div>
    <div class="logo py-10 font-bold text-2xl">
      <ElevateLogo :width="122" theme="dark" />
    </div>
    <nav class="text-right">
      <HamburgerButton
        :is-open="isMenuOpen"
        @menu-toggle="isMenuOpen = $event"
        class="lg:hidden"
      />
      <ul class="dapp-screen-header__navigation lg-max:hidden">
        <li
          v-for="(link, index) in links"
          :key="index"
          class="dapp-screen-header__link mx-3.5 inline-flex justify-center flex-row px-4 py-2 rounded-xl"
        >
          <!-- <inline-svg
            :src="getImageUrl(link.icon)"
            :width="17"
            class="dapp-screen-header__menu-icon inline-block mr-2 mt-0.5"
          /> -->
          <img
            v-if="showIcons"
            :src="getImageUrl(link.icon)"
            alt=""
            class="inline-block mr-2"
          />
          <router-link :to="link.path" v-html="link.text" />
        </li>
      </ul>
    </nav>
    <div class="lg-max:hidden">
      <DappButton
        >Disconnect Wallet
        <inline-svg
          :src="getImageUrl('icons/Plus-sign.svg')"
          :width="17"
          class="dapp-screen-header__button-icon inline-block"
      /></DappButton>
    </div>
  </div>
</template>

<script lang="ts" src="./Header.ts"></script>
