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
  <div class="dapp-screen-activities">
    <div class="container">
      <h2
        class="dapp-screen-activities__main-title"
        v-html="$t('activities.title')"
      />
      <div class="balance">
        <h3 class="balance__title" v-html="$t('activities.balance')" />
        <div class="balance__row">
          <div class="balance__amounts">
            <span class="balance__amount" v-html="balance" />
            <span class="balance__amount__dhp" v-html="dhpAmount" />
          </div>
          <div class="balance__bridge">
            <a
              href="http://explorer.dhealth.cloud/"
              target="_blank"
              rel="noopener"
              class="link"
            >
              <img :src="getImageUrl('dollar-sign.svg')" alt="" />{{
                $t("activities.bridge")
              }}
            </a>
          </div>
        </div>
      </div>
      <div class="dapp-screen-activities__filters">
        <DappSelect
          :placeholder="'Type'"
          :items="mockedSportTypes"
          :icon="'gift-icon.svg'"
          @input="handleInput"
          class="type"
        />
        <!-- <DappSelect class="date" :items="mockedSportTypes" /> -->
      </div>
      <div class="activities-table">
        <div class="titles row">
          <div
            v-for="(activityTitle, index) in activitiesTableTitles"
            :key="activityTitle + index"
            class="item"
          >
            {{ activityTitle }}
          </div>
        </div>
        <div
          class="row"
          v-for="(item, index) in activityItems"
          :key="index + item.distance"
        >
          <div class="item">
            <img
              v-if="item.sport"
              :src="getImageUrl(`activities-icons/${item.sport}.svg`)"
              :alt="item.sport"
            />
            {{ item.sport }}
          </div>
          <div class="item" v-html="item.elapsedTime" />
          <div class="item" v-html="item.distance" />
          <div class="item" v-html="item.elevationGain" />
          <div class="item" v-html="item.avgPace" />
          <div class="item" v-html="item.assets.length ? item.assets[0] : 0" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Activities.ts"></script>

<style lang="scss">
@import "./Activities.scss";
</style>
