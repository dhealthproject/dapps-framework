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
import { Injectable, HttpException } from "@nestjs/common";

// internal dependencies
// import { AuthService } from "./AuthService";

@Injectable()
export class ActivitiesService {
  protected activitiesList: any[] = [
    {
      position: 0,
      id: 12345678987654321,
      resource_state: 3,
      external_id: "garmin_push_12345678987654321",
      upload_id: 98765432123456789,
      athlete: {
        id: 134815,
        resource_state: 1,
      },
    },
    {
      position: 1,
      id: 12345673457654321,
      resource_state: 2,
      external_id: "garmin_push_12345673457654321",
      upload_id: 98765432123456123,
      athlete: {
        id: 134466,
        resource_state: 2,
      },
    },
    {
      position: 2,
      id: 12345673457654421,
      resource_state: 2,
      external_id: "garmin_push_12345673457654421",
      upload_id: 98765432123456333,
      athlete: {
        id: 135566,
        resource_state: 2,
      },
    },
    {
      position: 3,
      id: 32345673457654421,
      resource_state: 2,
      external_id: "garmin_push_32345673457654421",
      upload_id: 92495432123456333,
      athlete: {
        id: 137866,
        resource_state: 2,
      },
    },
    {
      position: 4,
      id: 12367673457654421,
      resource_state: 2,
      external_id: "garmin_push_12367673457654421",
      upload_id: 92495432123456098,
      athlete: {
        id: 137230,
        resource_state: 2,
      },
    },
    {
      position: 5,
      id: 61967673457654421,
      resource_state: 2,
      external_id: "garmin_push_61967673457654421",
      upload_id: 84725432123456098,
      athlete: {
        id: 137929,
        resource_state: 2,
      },
    },
    {
      position: 6,
      id: 12345678987654321,
      resource_state: 3,
      external_id: "garmin_push_12345678987654321",
      upload_id: 98765432123456789,
      athlete: {
        id: 134815,
        resource_state: 1,
      },
    },
    {
      position: 7,
      id: 12345673457654321,
      resource_state: 2,
      external_id: "garmin_push_12345673457654321",
      upload_id: 98765432123456123,
      athlete: {
        id: 134466,
        resource_state: 2,
      },
    },
    {
      position: 8,
      id: 12345673457654421,
      resource_state: 2,
      external_id: "garmin_push_12345673457654421",
      upload_id: 98765432123456333,
      athlete: {
        id: 135566,
        resource_state: 2,
      },
    },
    {
      position: 9,
      id: 32345673457654421,
      resource_state: 2,
      external_id: "garmin_push_32345673457654421",
      upload_id: 92495432123456333,
      athlete: {
        id: 137866,
        resource_state: 2,
      },
    },
    {
      position: 10,
      id: 12367673457654421,
      resource_state: 2,
      external_id: "garmin_push_12367673457654421",
      upload_id: 92495432123456098,
      athlete: {
        id: 137230,
        resource_state: 2,
      },
    },
    {
      position: 11,
      id: 61967673457654421,
      resource_state: 2,
      external_id: "garmin_push_61967673457654421",
      upload_id: 84725432123456098,
      athlete: {
        id: 137929,
        resource_state: 2,
      },
    },
    {
      position: 12,
      id: 12345678987654321,
      resource_state: 3,
      external_id: "garmin_push_12345678987654321",
      upload_id: 98765432123456789,
      athlete: {
        id: 134815,
        resource_state: 1,
      },
    },
    {
      position: 13,
      id: 12345673457654321,
      resource_state: 2,
      external_id: "garmin_push_12345673457654321",
      upload_id: 98765432123456123,
      athlete: {
        id: 134466,
        resource_state: 2,
      },
    },
    {
      position: 14,
      id: 12345673457654421,
      resource_state: 2,
      external_id: "garmin_push_12345673457654421",
      upload_id: 98765432123456333,
      athlete: {
        id: 135566,
        resource_state: 2,
      },
    },
    {
      position: 15,
      id: 32345673457654421,
      resource_state: 2,
      external_id: "garmin_push_32345673457654421",
      upload_id: 92495432123456333,
      athlete: {
        id: 137866,
        resource_state: 2,
      },
    },
    {
      position: 16,
      id: 12367673457654421,
      resource_state: 2,
      external_id: "garmin_push_12367673457654421",
      upload_id: 92495432123456098,
      athlete: {
        id: 137230,
        resource_state: 2,
      },
    },
    {
      position: 17,
      id: 61967673457654421,
      resource_state: 2,
      external_id: "garmin_push_61967673457654421",
      upload_id: 84725432123456098,
      athlete: {
        id: 137929,
        resource_state: 2,
      },
    },
  ];

  constructor() {}

  async getActivies(headersObj: any, query: any) {
    const { authorization } = headersObj;

    if (!authorization) {
      throw new HttpException("Unathenticated", 403);
    }

    const { sort } = query;
    let { page, size } = query;
    page = +page;
    size = +size;

    if (!page && !size && !sort) {
      return this.activitiesList;
    }

    if (page && size && sort) {
      const sliced = this.activitiesList.slice((page - 1) * size, page * size);
      switch (sort) {
        case "ASC":
          return sliced.sort((a, b) => a.position - b.position);
        case "DESC":
          return sliced.sort((a, b) => b.position - a.position);
      }
    }

    if (sort) {
      switch (sort) {
        case "ASC":
          return this.activitiesList.sort((a, b) => a.position - b.position);
        case "DESC":
          return this.activitiesList.sort((a, b) => b.position - a.position);
      }
    }

    if (page && size) {
      return this.activitiesList.slice((page - 1) * size, page * size);
    }
  }
}
