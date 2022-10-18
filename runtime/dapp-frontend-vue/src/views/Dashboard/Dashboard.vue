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
  <div class="dapp-screen-dashboard">
    <div class="container">
      <h1
        v-if="getIntegrations && getIntegrations.length"
        class="dapp-screen-dashboard__title"
        v-html="`${formatAddress(currentUserAddress, 'dashes')} dashboard`"
      />
      <DividedScreen v-if="getIntegrations && getIntegrations.length" :gap="81">
        <template v-slot:left>
          <Card
            :title="i18n.$t('dashboard_key_stats_title')"
            :showBorders="false"
          >
            <template v-slot:content><Stats :data="stats" /></template
          ></Card>
          <Card
            :title="i18n.$t('dashboard_referral_title')"
            :showBorders="false"
          >
            <template v-slot:content>
              <div class="referral-box">
                <img :src="getImageUrl('coins.png')" alt="Invite friends" />
                <p
                  class="text-center"
                  v-html="i18n.$t('dashboard_referral_text')"
                />
                <div class="referral-box__input">
                  <input type="text" readonly value="JOINFIT22" />
                  <div class="copy" @click="copyToClipBoard($event, ref)">
                    <span class="text" v-html="referralLabel" />
                    <img
                      :src="getImageUrl('copy-icon.svg')"
                      alt="Copy referral code"
                    />
                  </div>
                </div>
                <UiButton :accent="true">
                  <img :src="getImageUrl('share-icon.svg')" alt="share" />
                  <span>Share your link</span>
                </UiButton>
                <router-link :to="{ name: 'legal.terms-and-conditions' }">
                  Terms & Conditions
                </router-link>
              </div>
            </template>
          </Card>
        </template>
        <template v-slot:right>
          <Card :title="''" :showBorders="false">
            <template v-slot:content> <Leaderboard /> </template
          ></Card>
        </template>
      </DividedScreen>
      <div v-else class="dapp-activate-wrapper">
        <div class="dapp-activate-screen text-center">
          <img
            :src="getImageUrl('workout.svg')"
            :alt="i18n.$t('dashboard_cta_strava_welcome_text')"
          />
          <h2 class="dapp-activate-screen__title">
            {{ i18n.$t("dashboard_cta_strava_welcome_text") }}
          </h2>
          <p class="dapp-activate-screen__description">
            {{ i18n.$t("dashboard_cta_strava_start_earning") }}
          </p>
          <UiButton
            :accent="true"
            class="dapp-activate-screen__integrate"
            @click="oauthAuthorizeRedirect"
          >
            {{ i18n.$t("dashboard_cta_strava_integrate_strava") }}
          </UiButton>
          <p class="add-strava">
            {{ i18n.$t("dashboard_cta_strava_download_strava") }}
            &nbsp;<a href="#" target="_blank">{{ i18n.$t("word_here") }}</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Dashboard.ts"></script>

<style lang="scss">
@import "./Dashboard.scss";
</style>
