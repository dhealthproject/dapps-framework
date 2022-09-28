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
  <div class="dapp-screen-settings">
    <div class="settings-item">
      <div class="description">
        <div class="container text-left">
          <p>
            {{ i18n.$t("settings_integrations_description_text") }}
          </p>
        </div>
      </div>
      <div
        v-for="(integration, index) in integrationsList"
        :key="integration.id + index"
        class="setting"
        @click="removeIntegration(integration.id)"
      >
        <div class="container text-left">
          <div class="text-left flex flex-row justify-between items-center">
            <div class="content flex flex-row items-center">
              <img
                :src="getImageUrl(integrationsList[index].icon)"
                alt="Strava"
              />
              <div class="text">
                <span class="title" v-html="integrationsList[index].title" />
                <span
                  class="descr"
                  v-html="integrationsList[index].description"
                />
              </div>
            </div>
            <div class="state">
              <span class="state__description">Connected</span>
              <img :src="getImageUrl('conntect-check.svg')" alt="Connected" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Settings.ts"></script>
