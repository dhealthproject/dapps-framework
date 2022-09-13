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
  <div class="dapp-screen-onboarding">
    <DividedScreen
      :gap="0"
      :leftSize="100"
      rightSize="637px"
      class="dapp-screen-onboarding__inner"
    >
      <template v-slot:left>
        <div class="hero">
          <!-- @Todo: make bgimage dynamic -->
          <div
            class="hero__image"
            :style="{
              backgroundImage: `url(${getImageUrl(currentItem.image)})`,
            }"
          />
          <div class="hero__overlay" />
        </div>
      </template>
      <template v-slot:right>
        <div class="onboarding-steps">
          <NavPanel>
            <template v-slot:nav-left v-if="currentScreen > 0">
              <img
                class="onboarding-steps__back"
                :src="getImageUrl('icons/arrow-back.svg')"
                @click="handleBack"
                alt="Back"
              />
            </template>
            <template v-slot:nav-center>
              <div class="text-center">
                <ElevateLogo :width="122" theme="light" />
              </div>
            </template>
            <template v-slot:nav-right>
              <span
                class="onboarding-steps__skip"
                v-html="'skip'"
                @click="skipOnboarding"
              />
            </template>
          </NavPanel>
          <div class="onboarding-steps__carousel text-center">
            <div
              v-for="(item, index) in carouselItems"
              v-show="currentScreen === index"
              :key="item.id + index"
              class="slide"
            >
              <h2 class="slide__title" v-html="item.title" />
              <p class="slide__description" v-html="item.text" />
              <UiButton
                :accent="currentScreen === 2"
                @uiButton-click="handleStep"
                class="slide__button"
                >{{ item.button }}</UiButton
              >
            </div>
            <div class="flex flex-row">
              <div
                v-for="n in carouselItems.length"
                :key="n"
                :class="{ active: n - 1 === currentScreen }"
                class="steps-dot"
                @click="currentScreen = n - 1"
              />
            </div>
            <UiButton
              :accent="currentScreen === 2"
              @uiButton-click="handleStep"
              class="slide__button"
              >{{ currentItem.button }}</UiButton
            >
            <UiButton
              v-if="!refCode"
              :type="'no-borders'"
              @uiButton-click="handleReferral"
              >Enter a Referral Code</UiButton
            >
          </div>
        </div>
      </template>
    </DividedScreen>
    <!-- Mobile -->
    <div
      class="dapp-screen-onboarding__mobile"
      :style="`background-image: url(${getImageUrl(currentItem.image)})`"
    >
      <div
        :style="`background: ${currentItem.mobileGradient}`"
        class="dapp-screen-onboarding__mobile__gradient"
      />
      <div class="dapp-screen-onboarding__mobile__content">
        <NavPanel>
          <template v-slot:nav-left v-if="currentScreen > 0">
            <img
              class="onboarding-steps__back"
              :src="getImageUrl('icons/arrow-back.svg')"
              @click="handleBack"
              alt="Back"
            />
          </template>
          <template v-slot:nav-center>
            <div class="text-center">
              <ElevateLogo :width="122" theme="light" />
            </div>
          </template>
          <template v-slot:nav-right>
            <span
              class="onboarding-steps__skip"
              v-html="'skip'"
              @click="skipOnboarding"
            />
          </template>
        </NavPanel>
        <div class="dapp-screen-onboarding__mobile__actions">
          <div class="flex flex-row justify-center">
            <div
              v-for="n in carouselItems.length"
              :key="n"
              :class="{ active: n - 1 === currentScreen }"
              class="steps-dot"
              @click="currentScreen = n - 1"
            />
          </div>
          <h2 class="title" v-html="currentItem.title" />
          <p class="description" v-html="currentItem.text" />
          <UiButton
            :accent="currentScreen === 2"
            @uiButton-click="handleStep"
            class="slide__button"
            >{{ currentItem.button }}</UiButton
          >
          <UiButton
            v-if="!refCode"
            :type="'no-borders'"
            @uiButton-click="handleReferral"
            >Enter a Referral Code</UiButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./OnboardingScreen.ts"></script>
