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
      <Snackbar
        v-if="hasSnackBar"
        :icon="getImageUrl('QR.svg')"
        :title="snackbarConfig.title"
        :description="snackbarConfig.description"
        :state="snackbarConfig.state"
        @snackbar-close="hideSnackbar"
      />
      <DividedScreen v-if="getIntegrations.length > 0">
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
              <Tabs :tab-list="statisticsTabs">
                <template v-slot:tabContent="props">
                  <div class="dapp-screen-dashboard__section">
                    <GenericList
                      :items="props.tabData.quickStats"
                      :title="`Quick Stats for ${currentUserAddress}`"
                    >
                      <template v-slot:itemContent="props">
                        <div class="quick-stats__item">
                          <div class="flex flex-row items-center">
                            <div class="number">
                              {{ props.itemData.amount }}
                            </div>
                            <DirectionTriangle
                              :direction="props.itemData.direction"
                            />
                          </div>
                          <div class="title">{{ props.itemData.title }}</div>
                        </div>
                      </template>
                    </GenericList>
                  </div>
                  <div class="dapp-screen-dashboard__section">
                    <GenericList
                      :items="props.tabData.medals"
                      title="Your Medals"
                      class="medals"
                    >
                      <template v-slot:itemContent="props">
                        <img :src="getImageUrl(props.itemData)" alt="Medal 1" />
                      </template>
                    </GenericList>
                  </div>
                  <div class="dapp-screen-dashboard__section">
                    <GenericList
                      :items="props.tabData.friends"
                      title="Your Friends"
                    />
                  </div>
                </template>
              </Tabs> </template
          ></Card>
        </template>
      </DividedScreen>
      <div v-else class="dapp-activate-wrapper">
        <div class="dapp-activate-screen text-center">
          <img
            :src="getImageUrl('add-provider.png')"
            :alt="i18n.$t('dashboard_cta_strava_welcome_text')"
          />
          <h2 class="dapp-activate-screen__title">
            {{ i18n.$t("dashboard_cta_strava_welcome_text") }}
          </h2>
          <p class="dapp-activate-screen__description">
            {{ i18n.$t("dashboard_cta_strava_start_earning") }}
          </p>
          <button
            class="dapp-activate-screen__integrate"
            @click="oauthAuthorizeRedirect"
          >
            {{ i18n.$t("dashboard_cta_strava_integrate_strava") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Dashboard.ts"></script>

<style lang="scss">
@import "./Dashboard.scss";
</style>
