/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vuex Store
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

// external dependencies
import { ActionContext } from "vuex";

// internal dependencies
import { RootState } from "./Store";
import { AwaitLock } from "../AwaitLock";
import { NotificationsService } from "../../services/NotificationsService";
import moment from "moment";

// creates an "async"-lock for state of pending initialization
// this will be kept *locally* to this store module implementation
const Lock = AwaitLock.create();

moment.relativeTimeThreshold("d", 30 * 12);
moment.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ",
    s: "sec",
    m: "%dm",
    mm: "%dm",
    h: "%dh",
    hh: "%dh",
    d: "%dd",
    dd: "%dd",
    M: "amth",
    MM: "%dmths",
    y: "y",
    yy: "%dy",
  },
});

export interface NotificationsModuleState {
  initialized: boolean;
  notifications: any[];
}

/**
 *
 */
export type NotificationsModuleContext = ActionContext<
  NotificationsModuleState,
  RootState
>;

export const NotificationsModule = {
  // this store module is namespaced, meaning the
  // module name must be included when calling a
  // mutation, getter or action, i.e. "integrations/getIntegrations".
  namespaced: true,
  state: (): NotificationsModuleState => ({
    initialized: false,
    notifications: [],
  }),

  getters: {
    getNotifications: (state: NotificationsModuleState): any[] =>
      state.notifications,
  },

  mutations: {
    /**
     *
     */
    setInitialized: (state: NotificationsModuleState, payload: boolean) =>
      (state.initialized = payload),

    /**
     *
     */
    setNotifications: (state: NotificationsModuleState, payload: any[]) => {
      const notifications = payload.map((notification: any) => ({
        ...notification,
        icon: "dhealth-notifications-icon.svg",
        createdAt: moment(new Date(notification.createdAt)).fromNow(true),
      }));
      state.notifications = notifications;
    },
  },

  actions: {
    /**
     *
     */
    async fetchNotifications(
      context: NotificationsModuleContext,
      address: string
    ): Promise<any[] | undefined> {
      try {
        const service = new NotificationsService();
        const response = await service.getNotificationsByAddress(address);

        context.commit("setNotifications", response.data.reverse());

        return response.data;
      } catch (err) {
        console.log("Error fetchNotifications()", err);
      }
    },

    /**
     *
     */
    async markNotificationAsRead(
      context: NotificationsModuleContext,
      payload: any
    ): Promise<any[] | undefined> {
      try {
        const service = new NotificationsService();
        const response = await service.patchNotificationAsRead(payload);

        context.commit("setNotifications", response.data.reverse());

        return response.data;
      } catch (err) {
        console.log("Error fetchNotifications()", err);
      }
    },
  },
};
