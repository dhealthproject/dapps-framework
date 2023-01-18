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
  <div class="dapp-medals">
    <div class="container">
      <!-- Computed tempMedals used temporarily -->
      <RewardsList
        :title="$t('medals.badge_title')"
        :description="$t('medals.badge_description')"
        :medals="knownMedals"
      />
      <!-- <h2 class="boards-title" v-html="$t('medals.medal_board')" /> -->
    </div>
  </div>
</template>

<script lang="ts" src="./Medals.ts"></script>
