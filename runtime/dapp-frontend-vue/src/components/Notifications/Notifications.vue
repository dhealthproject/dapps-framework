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
  <div class="dapp-notifications" v-click-outside="hideNotifications">
    <div class="dapp-notifications__icon" @click="isOpen = !isOpen">
      <img
        v-if="unreadExist"
        :src="getImageUrl('notifications-new.svg')"
        alt="New notifications available"
      />
      <img
        v-else
        :src="getImageUrl('notifications.svg')"
        alt="No new notifications"
      />
    </div>
    <div v-if="isOpen" class="dapp-notifications__list">
      <div
        v-for="(notification, index) in items"
        :key="index"
        class="notification-item"
        @click="viewNotification(notification)"
      >
        <div class="flex items-center justify-between">
          <div class="icon">
            <div class="flex">
              <div class="icon-wrapper">
                <img
                  v-if="notification.icon"
                  :src="getImageUrl(notification.icon)"
                  :alt="notification.title"
                />
              </div>
              <div>
                <h3 v-html="notification.title" />
                <p v-html="notification.shortDescription" />
              </div>
            </div>
          </div>
          <div class="state">
            <p class="time" v-html="notification.createdAt" />
            <div v-if="!notification.readAt" class="unread-circle" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./Notifications.ts"></script>
