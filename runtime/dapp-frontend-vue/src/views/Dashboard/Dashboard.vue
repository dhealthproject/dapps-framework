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
              <EventsCarousel :items="carouselItems" :config="sliderConfig" />
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
                  <!-- <pre>{{ props }}</pre> -->
                </template>
              </Tabs>
              <div class="tabs">
                <!-- <div v-if="selectedTab === 0" class="tab-content">
                  <section class="dapp-screen-dashboard__stats__section">
                    <h2 class="title">Your Friends</h2>
                    <div class="friends-list">
                      <div class="friend-list__item">
                        <img :src="getImageUrl('friend1.png')" alt="" />
                        <span class="name">Yoga Maestro</span>
                        <DappButton>Go 1-on-1</DappButton>
                      </div>
                      <div class="friend-list__item">
                        <img :src="getImageUrl('friend2.png')" alt="" />
                        <span class="name">Terminator</span>
                        <DappButton>Go 1-on-1</DappButton>
                      </div>
                    </div>
                  </section>
                </div>
                <div v-if="selectedTab === 1" class="tab-content">
                  <section class="dapp-screen-dashboard__stats__section">
                    <h2 class="title">Quick Stats</h2>
                    <div class="quick-stats">
                      <div
                        v-for="(item, index) in quickStatsDaily"
                        :key="index"
                        class="quick-stats__item"
                      >
                        <div class="flex items-center">
                          <div class="number">{{ item.amount }}</div>
                          <DirectionTriangle :direction="item.direction" />
                        </div>
                        <div class="title">{{ item.title }}</div>
                      </div>
                    </div>
                  </section>
                  <section class="dapp-screen-dashboard__stats__section">
                    <h2 class="title">Your Medals</h2>
                    <div class="medals">
                      <img :src="getImageUrl('medal1.svg')" alt="Medal 1" />
                      <img :src="getImageUrl('medal2.svg')" alt="Medal 2" />
                    </div>
                  </section>
                  <section class="dapp-screen-dashboard__stats__section">
                    <h2 class="title">Your Friends</h2>
                    <div class="friends-list">
                      <div class="friend-list__item">
                        <img :src="getImageUrl('friend2.png')" alt="" />
                        <span class="name">Terminator</span>
                        <DappButton>Go 1-on-1</DappButton>
                      </div>
                    </div>
                  </section>
                </div> -->
              </div>
            </template></Card
          >
        </template>
      </DividedScreen>
    </div>
  </div>
</template>

<script lang="ts" src="./Dashboard.ts"></script>

<style lang="scss">
@import "./Dashboard.scss";
</style>
