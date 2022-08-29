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
  <div @click="$emit('menu-toggle', !isOpen)" class="cursor-pointer">
    <img :src="getImageUrl(iconPath)" alt="Menu" />
  </div>
</template>

<script lang="ts" src="./HamburgerButton.ts"></script>
