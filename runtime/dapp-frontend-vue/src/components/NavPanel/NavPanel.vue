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
  <div class="dapp-nav-panel w-[100%]">
    <div class="flex flex-row justify-between items-center">
      <div class="dapp-nav-panel__left">
        <slot name="nav-left" />
      </div>
      <div class="dapp-nav-panel__center">
        <slot name="nav-center" />
      </div>
      <div class="dapp-nav-panel__right">
        <slot name="nav-right" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./NavPanel.ts"></script>
