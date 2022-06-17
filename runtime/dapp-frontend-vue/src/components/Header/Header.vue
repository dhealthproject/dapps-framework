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
  <div class="header flex row justify-around">
    <div class="logo py-10 font-bold text-2xl">Elevate</div>
    <nav class="text-right">
      <ul>
        <li
          v-for="(link, index) in links"
          :key="index"
          class="inline-block mx-8"
        >
          <router-link :to="link.path" v-html="link.text" />
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts" src="./Header.ts"></script>
