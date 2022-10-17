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
  <div class="dapp-stats">
    <div class="dapp-stats__total-earned">
      <p class="amount-big">
        <span class="dark" v-html="fourDigitsAmount[0]" />
        <span class="light" v-html="fourDigitsAmount[1]" />
      </p>
      <div class="amount-small">
        <span
          v-if="data && data.totalEarned"
          v-html="`${data.totalEarned.toFixed(1)} $FIT earned`"
        />
        <inline-svg :src="getImageUrl('icons/info-tip.svg')" />
      </div>
    </div>
    <div class="dapp-stats__other">
      <div class="minutes">
        <span class="minutes__amount" v-html="data.totalPracticedMinutes" />
        <span class="dapp-stats__other__label" v-html="'Minutes Exercised'" />
      </div>
      <div class="activities-list text-right">
        <TopActivities :items="data.topActivities" />
        <span class="dapp-stats__other__label" v-html="'Top Activities'" />
      </div>
    </div>
    <div class="dapp-stats__referred">
      <ProgressBar
        :steps="data.totalReferral"
        :completed-steps="data.levelReferral"
        :end-icon="'progress-medal.png'"
      />
    </div>
    <div class="dapp-stats__other">
      <div class="referred">
        <span class="amount" v-html="data.friendsReferred" />
        <span class="get-more"
          >30 more to get 5% boost and earn a digital medal
          <inline-svg :src="getImageUrl('icons/info-tip.svg')"
        /></span>
      </div>
      <div class="text-right">
        <span class="dapp-stats__other__label" v-html="'Friends Referred'" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Stats.ts"></script>
