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
  <div class="dapp-screen-header container">
    <div
      v-if="links.length !== 0"
      class="dapp-screen-header__default flex row items-center"
    >
      <div class="logo py-10 font-bold text-2xl">
        <ElevateLogo :width="167" theme="dark" />
      </div>
      <nav class="text-right">
        <ul class="dapp-screen-header__navigation">
          <li
            v-for="(link, index) in links"
            :key="index"
            class="dapp-screen-header__link mx-3.5 inline-flex justify-center flex-row px-4 py-2 rounded-xl"
          >
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
      <div>
        <DappButton @click="disconnectWallet()"
          >Disconnect Wallet
          <inline-svg
            :src="getImageUrl('icons/Plus-sign.svg')"
            :width="17"
            class="dapp-screen-header__button-icon inline-block"
        /></DappButton>
      </div>
    </div>
    <div
      v-else
      class="dapp-screen-header__no-links place-content-between flex row items-center py-[37px]"
    >
      <div>
        <ElevateLogo :width="212" theme="dark" />
      </div>
      <div>
        <img
          :src="getImageUrl('dhealth-network-logo.svg')"
          alt="Dhealth Network"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Header.ts"></script>
