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
        <span v-html="`${totalEarned.toFixed(1)} $ACTIV earned`" />
        <InfoTip
          :title="$t('dashboard.stats_tooltip_earned_title')"
          :text="$t('dashboard.stats_tooltip_earned_text')"
        />
      </div>
    </div>
    <div class="dapp-stats__other">
      <div class="minutes">
        <span class="minutes__amount" v-html="totalPracticedMinutes" />
        <span
          class="dapp-stats__other__label"
          v-html="$t('dashboard.stats_minutes_exercised')"
        />
      </div>
      <div class="activities-list text-right">
        <TopActivities
          :items="topActivities.length ? topActivities : ['Ride', 'Swim']"
        />
        <span
          class="dapp-stats__other__label"
          v-html="$t('dashboard.stats_top_activities')"
        />
      </div>
    </div>
    <div class="dapp-stats__referred">
      <ProgressBar
        :steps="numReferralSteps"
        :completed-steps="levelReferral"
        :end-icon="'progress-medal.png'"
      />
    </div>
    <div class="dapp-stats__other">
      <div class="referred">
        <span class="amount" v-html="totalReferral" />
        <span class="get-more"
          >{{ $t("dashboard.stats_get_more") }}
          <InfoTip
            :title="$t('dashboard.stats_tooltip_referral_title')"
            :text="$t('dashboard.stats_tooltip_referral_text')"
        /></span>
      </div>
      <div class="text-right">
        <span
          class="dapp-stats__other__label"
          v-html="$t('dashboard.stats_friends_referred')"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Stats.ts"></script>
