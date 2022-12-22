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
  <div :class="{ 'with-icon': Boolean(icon) }" class="dapp-select">
    <img
      class="dapp-select__icon"
      v-if="icon"
      :src="getImageUrl(icon)"
      alt="icon"
    />
    <div v-if="type === 'list'" class="dapp-select__list">
      <div class="dapp-select__wrapper">
        <v-select
          :options="items"
          :searchable="false"
          :placeholder="placeholder"
          :input-id="inputId"
          :clearable="false"
        >
          <template #open-indicator="{ attributes }">
            <span v-bind="attributes">
              <img
                :src="getImageUrl('select-open.svg')"
                :alt="'Dropdown icon'"
              />
            </span>
          </template>
        </v-select>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./DappSelect.ts"></script>

<style lang="scss">
@import "./DappSelect.scss";
</style>
