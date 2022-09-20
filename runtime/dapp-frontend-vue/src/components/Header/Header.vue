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
    <transition name="slide">
      <div
        v-if="isMenuOpen"
        class="dapp-screen-header__menu-overlay flex flex-col"
      >
        <div class="dapp-screen-header__menu-overlay__actions">
          <div class="flex items-center">
            <div class="flex-auto text-left">
              <ElevateLogo :width="122" theme="dark" />
            </div>
            <div class="flex-auto text-right">
              <HamburgerButton
                :is-open="isMenuOpen"
                @menu-toggle="isMenuOpen = $event"
                class="dapp-screen-header__hamburger"
              />
            </div>
          </div>
        </div>
        <div
          v-if="isAuthenticated"
          class="dapp-screen-header__menu-overlay__profile-stats"
        >
          <div class="flex items-center pb-[16px] inner">
            <div class="pr-[24px]">
              <img
                class="w-[64px] h-[64px]"
                :src="getImageUrl('profile-avatar.png')"
                alt="User avatar"
              />
            </div>
            <div class="flex flex-col flex-auto text-left">
              <span class="user-name">User Name</span>
              <span class="user-balance">User balance: <b>$0.00</b></span>
            </div>
          </div>
        </div>
        <div class="dapp-screen-header__menu-overlay__nav-links">
          <ul>
            <li v-for="(link, index) in links" :key="link.text + index">
              <img
                v-if="showIcons"
                :src="getImageUrl(link.icon)"
                alt=""
                class="inline-block mr-4 w-[24px] h-[24px]"
              />
              <router-link :to="link.path" v-html="link.text" />
            </li>
          </ul>
        </div>
        <div class="dapp-screen-header__menu-overlay__footer text-left">
          <button>
            Disconnect Wallet
            <inline-svg
              :src="getImageUrl('disconnect.svg')"
              :width="16"
              :height="16"
            />
          </button>

          <div class="legal-credentials">
            <span class="powered">Powered by </span>
            <inline-svg :src="getImageUrl('dhealth-logo.svg')" />
          </div>

          <div class="legal-links">
            <router-link :to="{}" v-html="'Privacy Policy'" />
            <router-link
              :to="{ name: 'legal.terms-of-service' }"
              v-html="'Terms of Service'"
            />
          </div>
        </div>
      </div>
    </transition>
    <div v-if="hasBackButton" class="dapp-screen-header__back-button">
      <slot name="back-button" />
    </div>
    <div class="logo py-10 font-bold text-2xl">
      <ElevateLogo :width="138" theme="dark" />
    </div>
    <nav class="text-right">
      <HamburgerButton
        :is-open="isMenuOpen"
        @menu-toggle="isMenuOpen = $event"
        class="dapp-screen-header__hamburger"
      />
      <ul class="dapp-screen-header__navigation lg-max:hidden">
        <li
          v-for="(link, index) in links"
          :key="index"
          :class="`dapp-screen-header__link ${
            index === links.length - 1 ? '' : 'mr-[20px]'
          } inline-block px-4 py-2 rounded-xl`"
        >
          <router-link
            class="inline-flex items-center flex-row"
            :to="link.path"
          >
            <inline-svg
              :src="getImageUrl(link.icon)"
              :width="17"
              :class="`dapp-screen-header__menu-icon inline-block mr-[8px]`"
            />
            {{ link.text }}
          </router-link>
        </li>
      </ul>
    </nav>
    <div class="lg-max:hidden">
      <div class="dapp-screen-header__account-actions">
        <Dropdown :items="dropDownItems" />
        <UserBalance />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Header.ts"></script>
