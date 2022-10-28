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
import { Injectable, LoggerService } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import dayjs from "dayjs";

// internal dependencies
import { OAuthService } from "../../common/services/OAuthService";
import { StravaWebHookEventRequest } from "../../common/drivers/strava/StravaWebHookEventRequest";
import { QueryService } from "../../common/services/QueryService";
import {
  Activity,
  ActivityDocument,
  ActivityModel,
  ActivityQuery,
} from "../models/ActivitySchema";
import { ActivityDataDocument } from "../models/ActivityDataSchema";
import { ProcessingState } from "../models/ProcessingStatusDTO";
import { ActivitiesService } from "./ActivitiesService";
import { LogService } from "../../common/services/LogService";

// emitted events
import { OnActivityCreated } from "../events/OnActivityCreated";

/**
 * @class WebHooksService
 * @description Abstraction layer for webhooks that are executed from
 * third-party data providers. This class contains methods to validate,
 * process and format activities that are completed remotely, e.g. in
 * Strava.
 * <br /><br />
 * Note that this draft implementation is **only** compatible with
 * Strava activities and a further iteration shall abstract out the
 * events handling using OAuth Drivers.
 *
 * @since v0.3.2
 */
@Injectable()
export class WebHooksService {
  /**
   * This property permits to log information to the console or in files
   * depending on the configuration. This logger instance can be accessed
   * by extending listeners to use a common log process.
   *
   * @access protected
   * @var {LoggerService}
   */
  protected logger: LoggerService;

  /**
   * Constructs an instance of this service.
   *
   * @access public
   * @constructor
   * @param {ActivityModel} model
   * @param {QueryService<ActivityDocument, ActivityModel>} queryService
   * @param {EventEmitter2} eventEmitter
   */
  public constructor(
    @InjectModel(Activity.name)
    private readonly model: ActivityModel,
    private readonly queryService: QueryService<
      ActivityDocument,
      ActivityModel
    >,
    protected readonly oauthService: OAuthService,
    protected readonly activitiesService: ActivitiesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * This method handles incoming **events** from third-party
   * data providers such as Strava or Apple Health.
   *
   * @access public
   * @async
   * @param     {string}                      providerName  The OAuth provider name. This is the name of the third-party data provider, e.g. "strava".
   * @param     {string}                      userAddress   The dHealth Address of the account that belongs to the activity owner.
   * @param     {StravaWebHookEventRequest}   data          The activity's **headers**. Importantly, Strava does not share full details here.
   * @returns   {Promise<ActivityDocument>}   The created document that was added to `activities`.
   * @throws    {Error}                       Given invalid event payload, incompatible event payload or given any other error occurs while processing.
   * @emits     {@link OnActivityCreated}     Given a successful activity creation.
   */
  public async eventHandler(
    providerName: string,
    userAddress: string,
    data: StravaWebHookEventRequest,
  ): Promise<ActivityDocument> {
    // destructure obligatory fields for validation
    const { object_type, object_id, aspect_type, owner_id, event_time } = data;

    // make sure we have all obligatory fields
    if (!object_type || !object_id || !aspect_type || !owner_id) {
      throw new Error(`Invalid webhook event payload.`);
    }

    // ignore event if it is not compatible
    if (object_type !== "activity" || aspect_type !== "create") {
      throw new Error(`Incompatible webhook event payload.`);
    }

    // ignore event if it already exists
    if (
      await this.activitiesService.exists(
        new ActivityQuery({
          remoteIdentifier: object_id,
        } as ActivityDocument),
      )
    ) {
      throw new Error(`This activity has been discovered before.`);
    }

    // ------
    // Step 0: The webhook handler is **tried**
    try {
      // a Typescript `Date` is fundamentally specified as the number of
      // *milliseconds* that have elapsed since the starting epoch.
      const eventTime = new Date(event_time * 1000);
      const eventDate = dayjs(eventTime).format("YYYYMMDD");

      // count the activities of this athlete up to this one *today*
      const countToday: number = await this.queryService.count(
        new ActivityQuery({
          address: userAddress,
          dateSlug: eventDate,
        } as ActivityDocument),
        this.model,
      );

      // index uses date-only, index, object id and athlete id (x per day).
      // e.g. "20220910-1-123456-94380856"
      const activityIdx = countToday + 1;
      const activitySlug = [eventDate, activityIdx, object_id, owner_id].join(
        "-",
      );

      // creates a new document in `activities` that contains
      // only the *activity headers*. Activity details will be
      // discovered at a later point in time using schedulers.
      const activity = await this.queryService.createOrUpdate(
        new ActivityQuery({
          address: userAddress,
          slug: activitySlug,
        } as ActivityDocument),
        this.model,
        {
          remoteIdentifier: object_id,
          dateSlug: eventDate,
          createdAt: eventTime,
          provider: providerName.toLowerCase(),
        },
        {},
      );

      // internal event emission
      this.eventEmitter.emit(
        "processor.activity.created",
        OnActivityCreated.create(activitySlug),
      );

      // returns the created `ActivityDocument`
      return activity;
    } catch (err: any) {
      throw new Error(
        `An error occurred while handling event ${object_id}: ${err}`,
      );
    }
  }

  /**
   *
   */
  @OnEvent("processor.activity.created", { async: true })
  public async onActivityCreated(event: OnActivityCreated): Promise<void> {
    // initializes a logger with correct name
    this.logger = new LogService(`processor/onActivityCreated`);

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

    // (3) the following block will execute an API request to fetch
    // the activity data from a data provider as configured in `api_url`.

    // CAUTION: this may result in 2 requests being executed
    // due to the fact that access tokens may expire and need
    // to be renewed using another request to the provider API
    try {
      // executes an authorized API request to the data provider
      const response = await this.oauthService.callProviderAPI(
        `/activities/${activity.remoteIdentifier}`,
        integration,
      );

      // extracts the fields we want
      // @todo this is highly Strava-specific and should be abstracted out
      // @todo note that this data must not be accessible publicly
      // @todo CAUTION: make sure manual activities do not count!!
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
        //XXX sufferScore
        //XXX additionalData
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
          `"${activity.slug}". Error: "${e}"`,
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
      { activityData, processingState: ProcessingState.Processed },
    );
  }

  /**
   * This method uses the {@link logger} to print debug messages.
   *
   * @param   {string}              message
   * @param   {string|undefined}    context
   * @returns {void}
   */
  protected debugLog(message: string, context?: string): void {
    if (!!context) {
      this.logger.debug(message, context);
    } else this.logger.debug(message);
  }

  /**
   * This method uses the {@link logger} to print error messages.
   * Optionally, a `stack` can be passed to print a stack trace.
   *
   * @param   {string}              message
   * @param   {string|undefined}    stack
   * @param   {string|undefined}    context
   * @returns {void}
   */
  protected errorLog(message: string, stack?: string, context?: string): void {
    this.logger.error(message, stack, context);
  }
}
