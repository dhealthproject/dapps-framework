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
  <div class="dapp-ui-popup">
    <!-- Background overlay, as separate block in case hideOverlay === true -->
    <div
      class="dapp-ui-popup__overlay"
      v-if="config.overlayColor"
      :style="`background-color: ${config.overlayColor}`"
      @click="handleBgClick"
    />

    <!-- Modal of type form -->
    <div
      v-if="config && config.type === 'form'"
      :style="`background: ${
        config.modalBg ? config.modalBg : '#fff'
      };max-width: ${config.width}px`"
      class="dapp-ui-popup__modal dapp-ui-popup__modal__form"
    >
      <div
        class="dapp-ui-popup__modal__form__close"
        @click="$root.$emit('modal-close')"
      >
        <inline-svg :src="getImageUrl('icons/close-icon.svg')" :width="24" />
      </div>

      <h2 class="dapp-ui-popup__modal__form__title">{{ config.title }}</h2>
      <div
        v-for="(field, index) in config.fields"
        :key="field.name + index"
        class="input-wrapper"
      >
        <input
          class="dynamic-input"
          type="text"
          :placeholder="field.placeholder"
          :name="field.name"
          @input="handleInput"
        />
      </div>
      <UiButton :disabled="!isFormFilled" @click="handleFormSubmission"
        >Submit</UiButton
      >
    </div>

    <!-- Modal of type notification -->
    <div
      v-if="config && config.type === 'notification'"
      :style="`background: ${
        config.modalBg ? config.modalBg : '#fff'
      };max-width: ${config.width}px`"
      class="dapp-ui-popup__modal dapp-ui-popup__modal__notification"
    >
      <div
        class="dapp-ui-popup__modal__notification__close"
        @click="$root.$emit('modal-close')"
      >
        <inline-svg :src="getImageUrl('icons/close-icon.svg')" :width="32" />
      </div>

      <div v-if="config.illustration" class="img-wrapper">
        <img
          :src="getImageUrl(config.illustration)"
          :alt="config.title || config.description"
        />
        <p v-html="config.description" />
      </div>
    </div>

    <!-- Share of type notification -->
    <div
      v-if="config && config.type === 'share'"
      class="dapp-ui-popup__modal dapp-ui-popup__modal__share"
      :style="`background: ${
        config.modalBg ? config.modalBg : '#fff'
      };max-width: ${config.width}px`"
    >
      <div class="flex flex-row justify-between items-center mb-[32px]">
        <div class="row-item">
          <h3 class="title" v-html="$t('common.word_share')" />
        </div>
        <div class="row-item">
          <inline-svg
            :src="getImageUrl('icons/close-icon.svg')"
            :width="32"
            class="dapp-ui-popup__modal__notification__close"
            @click="$root.$emit('modal-close')"
          />
        </div>
      </div>
      <div class="flex flex-row mb-[32px]">
        <div
          v-for="(item, index) in socialPlatforms"
          :key="index + item.title"
          class="social-item"
        >
          <a :href="item.shareUrl" target="_blank" rel="noopener">
            <img :src="getImageUrl(`${item.icon}`)" :alt="item.title" />
            <span class="title" v-html="item.title" />
          </a>
        </div>
      </div>
      <ReferralInput type="link" :val="refCode" />
    </div>
  </div>
</template>

<script lang="ts" src="./UiPopup.ts"></script>
