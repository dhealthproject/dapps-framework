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
  <ul v-if="items && items.length" class="dapp-activities">
    <li
      :class="{ sticked: sticked }"
      :style="{
        'z-index': sticked && index > 0 ? index : 0,
        right: `${6 * index}px`,
      }"
      v-for="(activity, index) in fetchedItems"
      :key="activity + index"
    >
      <inline-svg
        :src="getImageUrl(`activities-icons/${activity}.svg`)"
        :alt="activity"
        :title="`Activity type: ` + activity"
      />
    </li>
  </ul>
</template>

<script lang="ts" src="./TopActivities.ts"></script>
