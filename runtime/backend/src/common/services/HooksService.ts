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
import { BadRequestException, Injectable } from "@nestjs/common";
import dayjs from "dayjs";

// internal dependencies
import { ActivityDTO } from "../models/ActivityDTO";

/**
 * @class HooksService
 * @description Class that contains different
 * hook handlers
 *
 * example of usage: const hooks: HooksService = new HooksService();
 *
 * @since v0.2.0
 */
@Injectable()
export class HooksService {
  /**
   * Creates or updates new activity
   * in database, updates statistics
   *
   * @param data
   *
   */
  async createOrUpdateActivities<T extends ActivityDTO>(data: T) {
    // @Todo: replace with .findOne when dev-processor will be merged
    const mockedUsers = [
      {
        owner_id: "NATZJE-TZTZCG-GRBUYV-QRBEUF-N5LEGD-RSTNF2-GYA",
        referralCode: "",
        object_id: "1",
        exists: true,
        athleteId: "1122",
      },
    ];

    const mockedRewards = [{ rewardsId: "20220825-1122", exists: true }];

    const mockPostRewards = [];

    const { object_type, object_id, aspect_type, owner_id } = data;

    if (!object_type || !object_id || !aspect_type || !owner_id) {
      throw new BadRequestException("Wrong activity payload");
    }

    if (object_type !== "activity" || aspect_type !== "create") {
      return "EVENT_IGNORED";
    }

    // Step 0: The webhook handler is **tried**
    try {
      // Step 1: searches the user by it's Strava id(Address)
      const user: any = mockedUsers.find((user) => user.owner_id === owner_id);
      let referer: any;

      // bails out for unknown ATHLETE
      if (!user.exists) {
        return "EVENT_IGNORED";
      }

      if ("referredBy" in user && user.referredBy.length) {
        referer = mockedUsers.find(
          (refUser) => refUser.referralCode === user.referredBy,
        );
      }

      // prepares rewards entry
      const rewardedDate = new Date();
      const formattedDate = dayjs(rewardedDate).format("YYYYMMDD");
      console.log({ formattedDate });
      const address = user.owner_id;
      const athleteId = user.athleteId;
      const activityId = object_id; // from Strava

      // index uses date-only and athlete id (one per day).
      // e.g. "20211103-94380856"
      const rewardsId = `${formattedDate}-${athleteId}`;

      // Step 2: checks if there is already a rewards entry for today
      const reward: any = mockedRewards.find(
        (reward) => reward.rewardsId === rewardsId,
      );

      if (!reward.exists) {
        return "EVENT_IGNORED";
      }

      console.log({ address });

      mockPostRewards.push({
        address,
        athleteId,
        activityId,
        isProcessed: false,
        isConfirmed: false,
        rewardDay: formattedDate,
        referrerAddress:
          !!referer && !referer.empty ? referer.docs[0].data().address : null,
        activityAt: dayjs(rewardedDate).format("YYYY-MM-DD HH:mm:ss Z"),
      });

      return mockPostRewards;
    } catch (err) {
      throw new BadRequestException(`Error during sending activity: ${err}`);
    }
  }
}
