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
import { Activity } from "../routes/ActivitiesController";
// import { AuthService } from "./AuthService";

@Injectable()
export class ActivitiesService {
  // This is mocked activities list, should be removed when DB will be available
  // @Todo: replaced mock with actual DB
  protected activitiesList: Activity[] = [
    {
      id: 0,
      name: "John doe",
      distance: 3440,
      elapsed_time: 12343444,
      moving_time: 23333,
      total_elevation_gain: 45566,
      kilojoules: 32,
      calories: 134,
      start_date: "12344222",
    },
    {
      id: 1,
      name: "Jane doe",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 2,
      name: "Lorem Ipsum",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 3,
      name: "Dolor Sit",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 4,
      name: "Amet Un",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },

    {
      id: 5,
      name: "Hello World",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 6,
      name: "John doe",
      distance: 3440,
      elapsed_time: 12343444,
      moving_time: 23333,
      total_elevation_gain: 45566,
      kilojoules: 32,
      calories: 134,
      start_date: "12344222",
    },
    {
      id: 7,
      name: "Jane doe",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 8,
      name: "Lorem Ipsum",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 9,
      name: "Dolor Sit",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 10,
      name: "Amet Un",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },

    {
      id: 11,
      name: "Hello World",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 12,
      name: "Hey There",
      distance: 3440,
      elapsed_time: 12343444,
      moving_time: 23333,
      total_elevation_gain: 45566,
      kilojoules: 32,
      calories: 134,
      start_date: "12344222",
    },
    {
      id: 13,
      name: "I'm Activity",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 14,
      name: "Out Of Names",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 15,
      name: "But Will",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 16,
      name: "Keep Creating",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },

    {
      id: 17,
      name: "Random Names",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 18,
      name: "Carl Johnson",
      distance: 3440,
      elapsed_time: 12343444,
      moving_time: 23333,
      total_elevation_gain: 45566,
      kilojoules: 32,
      calories: 134,
      start_date: "12344222",
    },
    {
      id: 19,
      name: "Sonic the Hedgehog",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 20,
      name: "Pickachu",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 21,
      name: "Mario",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 22,
      name: "Donkey Kong",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
    {
      id: 23,
      name: "Godzilla",
      distance: 3455,
      elapsed_time: 2343424,
      moving_time: 3242244,
      total_elevation_gain: 765878,
      kilojoules: 55,
      calories: 444,
      start_date: "43245677",
    },
  ];

  /**
   * Gets activities from existinglist
   * can paginate, sort items
   *
   * @access public
   * @param {headersObj} any
   * @param {query} any
   */
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
          return sliced.sort((a, b) => a.id - b.id);
        case "DESC":
          return sliced.sort((a, b) => b.id - a.id);
      }
    }

    if (sort) {
      switch (sort) {
        case "ASC":
          return this.activitiesList.sort((a, b) => a.id - b.id);
        case "DESC":
          return this.activitiesList.sort((a, b) => b.id - a.id);
      }
    }

    if (page && size) {
      return this.activitiesList.slice((page - 1) * size, page * size);
    }
  }
}
