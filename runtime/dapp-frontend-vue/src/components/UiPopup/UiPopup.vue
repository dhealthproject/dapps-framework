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
      <inline-svg
        :src="getImageUrl('icons/close-icon.svg')"
        :width="24"
        class="dapp-ui-popup__modal__form__close"
        @click="$root.$emit('modal-close')"
      />
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
      <UiButton :disabled="!isFormFilled" @uiButton-click="handleFormSubmission"
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
      <inline-svg
        :src="getImageUrl('icons/close-icon.svg')"
        :width="32"
        class="dapp-ui-popup__modal__notification__close"
        @click="$root.$emit('modal-close')"
      />
      <div v-if="config.illustration" class="img-wrapper">
        <img
          :src="getImageUrl(config.illustration)"
          :alt="config.title || config.description"
        />
        <p v-html="config.description" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./UiPopup.ts"></script>