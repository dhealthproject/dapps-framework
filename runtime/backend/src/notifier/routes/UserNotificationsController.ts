/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

// external dependencies
import { Get, Controller, Param, Put, UseGuards, Body } from "@nestjs/common";

// internal dependencies
import { UserNotifier } from "../services/UserNotifier";
import { AuthGuard } from "../../common/traits/AuthGuard";

@Controller("notifications")
export class UserNotificationsController {
  constructor(private readonly notifier: UserNotifier) {}

  @UseGuards(AuthGuard)
  @Get(":address")
  async getNotificationsByAddress(@Param("address") address: string) {
    try {
      return await this.notifier.findAllByAddress(address);
    } catch (err) {
      throw err;
    }
  }

  @UseGuards(AuthGuard)
  @Put("read")
  async handleRead(@Body() notificationPayload: any) {
    console.log({ notificationPayload });

    try {
      await this.notifier.markAsRead(notificationPayload.id);
      return await this.notifier.findAllByAddress(notificationPayload.address);
    } catch (err) {
      throw err;
    }
  }
}
