/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import { Injectable } from "@nestjs/common";
import { StatsDTO } from "../models/StatsDTO";
import { ActivitiesService } from "@/processor/services/ActivitiesService";
import {
  ActivityQuery,
  ActivityDocument,
} from "@/processor/models/ActivitySchema";

@Injectable()
export class StatisticsService {
  constructor(private readonly activitiesService: ActivitiesService) {}

  // StatsDTO will be replaced with extended version of StatisticsDTO
  async getStats(address: string): Promise<StatsDTO> {
    // @todo Add address validation
    const items = await this.activitiesService.find(
      new ActivityQuery({ address } as ActivityDocument),
    );

    // will be used in future once activities collection will exist, currently value will be hardcoded
    const totalAmount = items.data.reduce((prevVal: number, currItem: any) => {
      return prevVal + currItem.amount;
    }, 0);

    // temporary return hardcoded object
    return {
      address: "NATZJETZTZCGGRBUYVQRBEUFN5LEGDRSTNF2GYA",
      period: "20220101",
      periodFormat: "D",
      totalPracticedMinutes: 1600,
      totalEarned: 3.92,
      topActivities: ["running", "walking"],
      totalReferral: 5,
      levelReferral: 2,
    };
  }
}
