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
  <div class="dapp-events-carousel">
    <vueper-slides
      ref="vueperslides2"
      :breakpoints="breakpoints"
      :arrows="config.arrows"
      :bullets="config.bullets"
      :visible-slides="config.visibleSlides"
      :gap="config.gap"
      :fixedHeight="config.itemsHeight"
    >
      <vueper-slide v-for="(carouselItem, index) in items" :key="index">
        <template #content>
          <div class="item">
            <img
              :src="getImageUrl(carouselItem.image)"
              :alt="carouselItem.footer.title"
              class="image"
            />
            <div
              class="text-data"
              :style="{ background: carouselItem.gradient }"
            >
              <div v-if="carouselItem.header" class="item__header">
                <img
                  :src="getImageUrl(carouselItem.header.icon)"
                  :alt="carouselItem.header.text"
                />
                <span class="item__header__provided">{{
                  carouselItem.header.text
                }}</span>
              </div>
              <div class="item__footer">
                <div class="item__footer__text">
                  <span class="item__footer__text__title">{{
                    carouselItem.footer.title
                  }}</span>
                  <br />
                  <span
                    >{{ carouselItem.footer.participants }} participants</span
                  >
                </div>
                <div class="item__footer__cta">
                  <UiButton
                    @uiButton-click="handleEventClick($event, carouselItem)"
                    :accent="true"
                    >Joined</UiButton
                  >
                </div>
              </div>
            </div>
          </div>
        </template>
      </vueper-slide>
    </vueper-slides>
  </div>
</template>

<script lang="ts" src="./EventsCarousel.ts"></script>

<style lang="scss">
@import "./EventsCarousel.scss";
</style>
