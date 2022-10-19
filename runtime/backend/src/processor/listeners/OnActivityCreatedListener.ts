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
import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import dayjs from "dayjs";

// internal dependencies
import { BaseEventListener } from "../../common/events/BaseEventListener";
import { AccountsService } from "../../common/services/AccountsService";
import { OAuthService } from "../../common/services/OAuthService";
import { ActivitiesService } from "../services/ActivitiesService";
import { ActivityDocument, ActivityQuery } from "../models/ActivitySchema";
import { ProcessingState } from "../models/ProcessingStatusDTO";
import { OnActivityCreated } from "../events/OnActivityCreated";
import { ActivityDataDocument } from "../models/ActivityDataSchema";

/**
 * @label LISTENERS
 * @class OnActivityCreatedListener
 * @description An event listener that is mapped to an event with name
 * `processor.activity.created`, i.e. {@link OnActivityCreated:EVENTS}.
 * <br /><br />
 * #### Purpose
 *
 * This event listener is used to instruct the backend runtime that it
 * may perform an *activity discovery* from the corresponding provider.
 *
 * @since v0.3.2
 */
@Injectable()
export class OnActivityCreatedListener extends BaseEventListener {
  /**
   * Constructs and prepares an instance of this listener.
   *
   * @access public
   * @param {OAuthService}        oauthService
   * @param {ActivitiesService}   activitiesService
   * @param {AccountsService}     accountsService
   */
  public constructor(
    protected readonly oauthService: OAuthService,
    protected readonly activitiesService: ActivitiesService,
    protected readonly accountsService: AccountsService,
  ) {
    super("processor", "OnActivityCreated");
  }

  /**
   *
   */
  @OnEvent("processor.activity.created", { async: true })
  public async handleEvent(event: OnActivityCreated): Promise<void> {
    console.log("[DEBUG][OnActivityCreatedListener] event 'processor.activity.created' caught: ", event);

    // (1) reads an activity by slug from database, the
    // slug field requires its' values to be unique.
    const activity = await this.activitiesService.findOne(
      new ActivityQuery({
        slug: event.slug,
      } as ActivityDocument),
    );

    // (2) find the user's OAuth authorization. The presence of
    // this authorization is *obligatory*, otherwise this listener
    // would fail and log an error/exception in persistent logs
    const integration = await this.oauthService.getIntegration(
      activity.provider,
      activity.address,
    );

    // in case we don't have a data provider *authorization*, stop
    if (null === integration) {
      // @todo print error message in persistent log such that it can be investigated
      // this activity's processing state updates to `-1`
      this.onError(
        activity,
        `` +
          `Missing OAuth authorization for ${activity.provider} with ` +
          `dHealth address "${activity.address}" and activity slug: ` +
          `"${activity.slug}".`,
      );

      // stop here
      return;
    }

    console.log("[DEBUG][OnActivityCreatedListener] Now requesting activity data from Strava API.");

    // (3) the following block will execute an API request to fetch
    // the activity data from a data provider as configured in `api_url`.

    // CAUTION: this may result in 2 requests being executed
    // due to the fact that access tokens may expire and need
    // to be renewed using another request to the provider API
    try {
      // executes an authorized API request to the data provider
      const response = await this.oauthService.callProviderAPI(
        `/activities/${integration.remoteIdentifier}`,
        integration,
      );

      console.log("[DEBUG][OnActivityCreatedListener] Activity data from Strava: ", response.data);

      // extracts the fields we want
      // @todo this is highly Strava-specific and should be abstracted out
      // @todo note that this data must not be accessible publicly
      const apiResponse = response.data;
      const activityData = {
        slug: activity.slug,
        address: activity.address,
        name: apiResponse.name ?? undefined,
        sport: apiResponse.sport_type,
        startedAt: dayjs(apiResponse.start_date).toDate().valueOf(),
        timezone: apiResponse.timezone,
        startLocation: apiResponse.start_latlng,
        endLocation: apiResponse.end_latlng,
        hasTrainerDevice: apiResponse.trainer,
        elapsedTime: apiResponse.elapsed_time,
        movingTime: apiResponse.moving_time,
        distance: apiResponse.distance,
        elevation: apiResponse.total_elevation_gain,
        kilojoules: apiResponse.kilojoules,
        calories: apiResponse.calories,
      } as ActivityDataDocument;

      // populates this activity's *data* in `activityData`
      await this.onSuccessActivityUpdate(activity, activityData);
      return;
    } catch (e: any) {
      // @todo print error message in persistent log such that it can be investigated
      // this activity's processing state updates to `-1`
      this.onError(
        activity,
        `` +
          `An error happened for ${activity.provider} during request with ` +
          `dHealth address "${activity.address}" and activity slug: ` +
          `"${activity.slug}".`,
        e.stack,
      );
    }
  }

  /**
   *
   */
  private async onError(
    activity: ActivityDocument,
    message: string,
    stack?: string,
  ): Promise<void> {
    //@todo print error message in persistent log such that it can be investigated
    if (undefined === stack) {
      this.errorLog(message);
    } else this.errorLog(message, stack);

    // this activity's processing state updates to `-1`
    await this.onFailureActivityUpdate(activity);
  }

  /**
   *
   */
  private async onFailureActivityUpdate(
    activity: ActivityDocument,
  ): Promise<ActivityDocument> {
    // this activity's processing state updates to `-1`
    return await this.activitiesService.createOrUpdate(
      new ActivityQuery({
        slug: activity.slug,
      } as ActivityDocument),
      { processingState: ProcessingState.Failed },
    );
  }

  /**
   *
   */
  private async onSuccessActivityUpdate(
    activity: ActivityDocument,
    activityData: ActivityDataDocument,
  ): Promise<ActivityDocument> {
    return await this.activitiesService.createOrUpdate(
      new ActivityQuery({
        slug: activity.slug,
      } as ActivityDocument),
      { activityData },
    );
  }
}
