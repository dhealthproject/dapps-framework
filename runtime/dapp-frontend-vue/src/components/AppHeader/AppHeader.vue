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
  <div
    :class="{ 'no-margin': $route.name === 'app.settings' }"
    class="dapp-screen-header"
  >
    <div class="container flex row items-center justify-between">
      <transition name="slide">
        <div
          v-if="isMenuOpen"
          class="dapp-screen-header__menu-overlay flex flex-col"
        >
          <div class="dapp-screen-header__menu-overlay__actions">
            <div class="flex items-center">
              <div class="flex-auto text-left">
                <ElevateLogo :width="92" theme="dark" />
              </div>
              <div class="flex-auto text-right">
                <MobileNavigationButton
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
            <div class="flex items-center pb-[31px] inner">
              <div class="flex items-center justify-center pr-[16px]">
                <Dropdown :items="dropDownItems" />
              </div>
              <div class="flex flex-col flex-auto text-left">
                <UserBalance />
              </div>
            </div>
          </div>
          <div class="dapp-screen-header__menu-overlay__nav-links">
            <ul>
              <li v-for="(link, index) in links" :key="link.text + index">
                <inline-svg
                  v-if="showIcons"
                  :src="getImageUrl(link.icon)"
                  :class="{
                    'icon-active': link.path.name === $route.name,
                  }"
                  alt=""
                  class="inline-block mr-[16px] w-[24px] h-[24px]"
                />
                <router-link :to="link.path" v-html="link.text" />
              </li>
            </ul>
            <UiButton :accent="true">
              <img :src="getImageUrl('icons/chain-icon.svg')" alt="Refer" />
              {{ $t("common.refer_friend") }}
            </UiButton>
          </div>
          <div class="dapp-screen-header__menu-overlay__footer text-left">
            <div class="legal-credentials">
              <span class="powered"
                >© {{ $t("common.foundation") }} {{ new Date().getFullYear() }}
              </span>
            </div>

            <div class="legal-links">
              <router-link :to="{}" v-html="$t('common.privacy_policy')" />
              <span class="divider">|</span>
              <router-link
                :to="{ name: 'legal.terms-of-service' }"
                v-html="$t('common.terms_of_service')"
              />
            </div>
          </div>
        </div>
      </transition>
      <div v-if="hasBackButton" class="dapp-screen-header__back-button">
        <slot name="back-button" />
      </div>
      <div class="logo font-bold text-2xl">
        <ElevateLogo :width="138" theme="dark" />
      </div>
      <nav class="text-right p-0">
        <MobileNavigationButton
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
      <div class="lg-max:hidden py-6">
        <div class="dapp-screen-header__account-actions">
          <Dropdown :items="dropDownItems" />
          <UserBalance />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./AppHeader.ts"></script>
