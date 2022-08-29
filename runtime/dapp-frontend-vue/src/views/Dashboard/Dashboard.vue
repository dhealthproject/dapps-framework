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
      <DividedScreen>
        <template v-slot:left>
          <Card title="Upcoming Events">
            <template v-slot:content>
              <EventsCarousel
                :items="carouselItems"
                :config="sliderConfig"
                :breakpoints="sliderBreakPoints"
              />
            </template>
          </Card>
          <Card title="Leaderboard">
            <template v-slot:content>
              <LeaderBoard :items="boardItems" />
            </template>
            <template v-slot:button>
              <DappButton
                >Refer a Friend
                <inline-svg
                  :src="getImageUrl('icons/Plus-sign.svg')"
                  :width="17"
                  class="dapp-screen-header__button-icon inline-block"
              /></DappButton>
            </template>
          </Card>
        </template>
        <template v-slot:right>
          <Card title="Your Stats" class="dapp-screen-dashboard__stats">
            <template v-slot:content>
              <Tabs :tab-list="tabs">
                <template v-slot:tabContent="props">
                  <div class="dapp-screen-dashboard__section">
                    <QuickStats :stats-config="props.tabData.quickStats" />
                  </div>
                  <div class="dapp-screen-dashboard__section">
                    <Medals :medals-list="props.tabData.medals" />
                  </div>
                  <div class="dapp-screen-dashboard__section">
                    <FriendsList :friends="props.tabData.friends" />
                  </div>
                </template>
              </Tabs> </template
          ></Card>
        </template>
      </DividedScreen>
    </div>
  </div>
</template>

<script lang="ts" src="./Dashboard.ts"></script>
