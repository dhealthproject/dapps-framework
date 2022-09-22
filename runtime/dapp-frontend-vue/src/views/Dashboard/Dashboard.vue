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
      <!-- <Snackbar
        v-if="snackbarkShown"
        :icon="getImageUrl('QR.svg')"
        title="Great Job!"
        description="We’ve integrated your account"
        @snackbar-close="hideSnackbar"
      /> -->
      <h1
        v-if="getIntegrations"
        class="dapp-screen-dashboard__title"
        v-html="`${currentUserAddress} dashboard`"
      />
      <DividedScreen v-if="getIntegrations" :gap="81">
        <template v-slot:left>
          <Tabs :title="'Quick Stats'" :tab-list="tabs">
            <template v-slot:tabContent="props">
              <Card>
                <template v-slot:content>
                  <div class="stats-card">
                    <div class="stats-card__numbers">
                      <div
                        v-for="(item, index) in props.tabData.quickStats"
                        :key="index + item.title"
                        class="item"
                      >
                        <div class="flex">
                          <span class="amount" v-html="item.amount" />
                          <DirectionTriangle :direction="item.direction" />
                        </div>
                        <span class="title" v-html="item.title" />
                      </div>
                    </div>
                    <ProgressBar :steps="5" :completed-steps="2" />
                    <div class="flex justify-around items-center">
                      <div class="progress-data">4/10</div>
                      <div class="progress-data">
                        <div class="text-right">
                          <span class="reffered">Friends Referred</span>
                          <img
                            :src="getImageUrl('icons/info-icon.svg')"
                            alt="Friends reffered"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </Card>
              <Card :title="'Your Sportscards'">
                <template v-slot:content
                  ><p class="empty-section">
                    You currently don’t have any sportcards.
                  </p></template
                >
              </Card>
              <Card :title="'Your Medals'">
                <template v-slot:content
                  ><p class="empty-section">
                    You currently don’t have any medals.
                  </p>

                  <GenericList :items="props.tabData.medals" class="medals">
                    <template v-slot:itemContent="props">
                      <img :src="getImageUrl(props.itemData)" alt="Medal 1" />
                    </template>
                  </GenericList>
                </template>
              </Card>
            </template>
          </Tabs>
        </template>
        <template v-slot:right>
          <Card :title="'Invite friends'" :showBorders="false">
            <template v-slot:content>
              <div class="referral-box">
                <img :src="getImageUrl('coins.png')" alt="Invite friends" />
                <p class="text-center">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit Ut et.
                </p>
                <div class="referral-box__input">
                  <input type="text" readonly value="JOINFIT22" />
                  <div class="copy">
                    <span class="text">Copy referral code</span>
                    <img
                      :src="getImageUrl('copy-icon.svg')"
                      alt="Copy referral code"
                      @click="copyToClipBoard($event, ref)"
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

          <Card :title="'Invite friends'" :showBorders="false">
            <template v-slot:content>
              <LeaderBoard :items="boardItems" /> </template
          ></Card>
        </template>
      </DividedScreen>
      <div v-else class="dapp-activate-wrapper">
        <div class="dapp-activate-screen text-center">
          <img
            :src="getImageUrl('workout.svg')"
            alt="Welcome to ELEVATE, this is the place where you can earn tokens for your activity"
          />
          <h2 class="dapp-activate-screen__title">
            Welcome! Integrate an account to start earning tokens for your
            activity.
          </h2>
          <p class="dapp-activate-screen__description">
            At the moment, we only support STRAVA integration.
          </p>
          <UiButton :accent="true" @uiButton-click="integrateStrava"
            >Integrate your STRAVA</UiButton
          >
          <p class="add-strava">
            Don’t have Strava? Download it <a href="#" target="_blank">here</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Dashboard.ts">
import DirectionTriangle from "@/components/DirectionTriangle/DirectionTriangle.vue";
import UiButton from "@/components/UiButton/UiButton.vue";
import LeaderBoard from "./components/LeaderBoard.vue";
</script>

<style lang="scss">
@import "./Dashboard.scss";
</style>
