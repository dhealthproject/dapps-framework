/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Vue Frontend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { Component, Prop } from "vue-property-decorator";
import InlineSvg from "vue-inline-svg";

// internal dependencies
import { MetaView } from "@/views/MetaView";
import { MedalItem } from "../RewardsList/RewardsList";

// style resource
import "./Notifications.scss";

export interface Notification {
  createdAt: string | number;
  title: string;
  description: string;
  icon: string;
  viewed: boolean;
  medal?: MedalItem;
  id: number | string;
}

/*
 * @class Notifications
 * @description This class implements a Vue component to display
 * latest notifications received by user
 *
 * @since v0.3.0
 */
@Component({
  components: {
    InlineSvg,
  },
  methods: {},
  computed: {},
})
export default class Notifications extends MetaView {
  /**
   * Prop which defines items for available notifications.
   *
   * @access protected
   * @var {Notification[]}
   */
  @Prop({ default: () => [] }) protected items?: Notification[];

  isOpen = false;

  /**
   * This computed checks if list contains
   * item with "viewed: false" prop.
   *
   * @access protected
   * @returns boolean
   */
  public get unreadExist(): boolean {
    const unread = this.items?.filter(
      (notification: any) => !notification.readAt
    );
    return !!unread && unread.length > 0;
  }

  public viewNotification(medalNotification: Notification) {
    this.$emit("notification-viewed", medalNotification);
    if (medalNotification.medal) {
      const relatedMedal = medalNotification.medal;
      this.$root.$emit("modal", {
        type: "medal",
        overlayColor: "rgba(0, 0, 0, 0.2)",
        width: 720,
        modalBg: "#FFFFFF",
        medal: relatedMedal.image,
        condition: relatedMedal.condition,
        activities: relatedMedal.relatedActivities,
      });
    }
  }

  hideNotifications() {
    if (this.isOpen) {
      this.isOpen = false;
    }
  }
}
