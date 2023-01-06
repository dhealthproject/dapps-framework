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
      <DividedScreen v-if="getIntegrations && getIntegrations.length" :gap="81">
        <template v-slot:left>
          <Card :title="$t('dashboard.key_stats_title')" :showBorders="false">
            <template v-slot:content><Stats /></template
          ></Card>
          <Card :title="$t('dashboard.referral_title')" :showBorders="false">
            <template v-slot:content>
              <div class="referral-box">
                <img
                  class="invite-icon"
                  :src="getImageUrl('coins-invite.svg')"
                  alt="Invite friends"
                />
                <h2 v-html="$t('dashboard.refer_boost')" />
                <p class="text-center" v-html="$t('dashboard.referral_text')" />
                <ReferralInput
                  :val="refInput"
                  :placeholder="$t('dashboard.copy_referral_code')"
                />
                <UiButton :accent="true" @click="shareModal">
                  <img :src="getImageUrl('share-icon.svg')" alt="share" />
                  <span v-html="$t('dashboard.share_link_title')" />
                </UiButton>
                <router-link :to="{ name: 'legal.terms-and-conditions' }">
                  {{ $t("common.terms_and_conditions") }}
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
            :alt="$t('dashboard.cta_strava_welcome_text')"
          />
          <h2 class="dapp-activate-screen__title">
            {{ $t("dashboard.cta_strava_welcome_text") }}
          </h2>
          <p class="dapp-activate-screen__description">
            {{ $t("dashboard.cta_strava_start_earning") }}
          </p>
          <UiButton
            :accent="true"
            class="dapp-activate-screen__integrate"
            @click="oauthAuthorizeRedirect"
          >
            {{ $t("dashboard.cta_strava_integrate_strava") }}
          </UiButton>
          <p class="add-strava">
            {{ $t("dashboard.cta_strava_download_strava") }}
            &nbsp;<a
              :href="
                getMobileOS === 'iOS'
                  ? 'https://apps.apple.com/us/app/strava-run-ride-hike/id426826309'
                  : 'https://play.google.com/store/apps/details?id=com.strava&hl=en&gl=US'
              "
              target="_blank"
              >{{ $t("common.word_here") }}</a
            >
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
