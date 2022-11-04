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
  <div class="dapp-screen-footer">
    <div
      v-if="layout === 'default'"
      class="dapp-screen-footer__default flex row justify-around"
    >
      <span class="dapp-screen-footer__copy"
        >&copy; dHealth dApps Framework</span
      >
      <nav class="text-right">
        <ul>
          <li
            v-for="(link, index) in links"
            :key="index"
            class="dapp-screen-footer__link inline-block mx-8"
          >
            <router-link :to="link.path" v-html="link.text" />
          </li>
        </ul>
      </nav>
    </div>
    <div v-else-if="layout === 'empty'" class="dapp-screen-footer__empty">
      <div
        class="dapp-screen-footer__empty__copy text-[20px] font-bold text-[#8A8A8A] pb-[4px]"
      >
        © {{ new Date().getFullYear() }} dHealth. All Rights Reserved
      </div>
      <div class="dapp-screen-footer__empty__links">
        <router-link
          v-for="(link, index) in links"
          :key="link.text + index"
          :to="link.path"
          class="text-[14px] text-[#8A8A8A] inline-block px-[5px] underline link"
          v-html="link.text"
        />
      </div>
    </div>
    <footer v-else-if="layout === 'version-only'">
      <div class="text-xs text-right px-[15px]">v{{ version }}</div>
    </footer>
  </div>
</template>

<script lang="ts" src="./Footer.ts"></script>
