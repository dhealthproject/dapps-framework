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
import { InjectModel } from "@nestjs/mongoose";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import moment from "moment";

// internal dependencies
import { OAuthService } from "./OAuthService";
import { OAuthEntityType } from "../drivers/OAuthEntity";
import { StravaWebHookEventRequest } from "../drivers/strava/StravaWebHookEventRequest";
import { QueryService } from "../../common/services/QueryService";
import { LogService } from "../../common/services/LogService";
import { AppConfiguration } from "../../AppConfiguration";
import {
  Activity,
  ActivityDocument,
  ActivityModel,
  ActivityQuery,
} from "../../users/models/ActivitySchema";
import { ActivityDataDocument } from "../../users/models/ActivityDataSchema";
import { ProcessingState } from "../../users/models/ProcessingStatusDTO";
import { ActivitiesService } from "../../users/services/ActivitiesService";

// emitted events
import { OnActivityCreated } from "../events/OnActivityCreated";
import { OnActivityDownloaded } from "../events/OnActivityDownloaded";

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
   * Constructs an instance of this service.
   *
   * @access public
   * @constructor
   * @param {ActivityModel} model
   * @param {QueryService<ActivityDocument, ActivityModel>} queryService
   * @param {OAuthService} oauthService
   * @param {ActivitiesService} activitiesService
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
   * <br /><br />
   * After a successful execution of processing an incoming event,
   * this method will *fire an internal event* with the identifier:
   * `oauth.activity.created`. This event can be caught to use
   * the fulfilled (completed) activity details in other places.
   *
   * @access public
   * @async
   * @param     {string}                      providerName  The OAuth provider name. This is the name of the third-party data provider, e.g. "strava".
   * @param     {string}                      userAddress   The dHealth Address of the account that belongs to the activity owner.
   * @param     {StravaWebHookEventRequest}   data          The activity's **headers**. Importantly, Strava does not share full activity details here.
   * @returns   {Promise<ActivityDocument>}   The created document that was added to `activities`.
   * @throws    {Error}                       Given invalid event payload, incompatible event payload or given any other error occurs while processing.
   * @emits     {@link OnActivityCreated}     Given a successful activity creation (processing success).
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
      const eventDate = moment(eventTime).format("YYYYMMDD");

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
        "oauth.activity.created",
        OnActivityCreated.create(activitySlug),
      );

      // print INFO for created activities
      const logger = new LogService(AppConfiguration.dappName);
      logger.log(`Saved incoming event from data provider "${providerName}"`);

      // returns the created `ActivityDocument`
      return activity;
    } catch (err: any) {
      throw new Error(
        `An error occurred while handling event ${object_id}: ${err}`,
      );
    }
  }

  /**
   * This method serves as an **event listener** for the internal
   * event with identifier `oauth.activity.created`. The main
   * purpose of this listener is to *request activity details* from
   * a data provider.
   * <br /><br />
   * An example *activity detail DTO* can be found on the Strava
   * documentation: https://developers.strava.com/docs/reference/#api-Activities-getActivityById
   * <br /><br />
   * Note that we do not store *all fields* that are returned by
   * the `/activities/:id` endpoint. More fields may be interpreted
   * in the future.
   * <br /><br />
   * Note that *event listeners* do not specify a *return type*. This
   * is because their execution is asynchronous.
   *
   * @access public
   * @async
   * @param     {OnActivityCreated}   event   The internal app event as triggered by {@link eventHandler}.
   * @returns   {Promise<void>}       No return is specified for an event listener to permit asynchronous behaviour.
   * @emits     {@link OnActivityDownloaded}     Given a successful activity details download from data provider (downloading success).
   * @throws    {Error}               Given missing OAuth authorization, unreachable/invalid Strava request or any other error occurs while requesting activity details.
   */
  @OnEvent("oauth.activity.created", { async: true })
  public async onActivityCreated(event: OnActivityCreated): Promise<void> {
    // event listener logs are grouped
    const logger = new LogService(`${AppConfiguration.dappName}/EVENTS`);

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
        logger,
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

      // extracts the fields we want (as an "activity")
      // @todo note that this data must not be accessible publicly
      const activityData: any = this.oauthService.extractProviderEntity(
        integration.name,
        response.data,
        OAuthEntityType.Activity,
      );

      // fills mandatory activity-level fields
      activityData.slug = activity.slug;
      activityData.address = activity.address;

      // internal event emission
      this.eventEmitter.emit(
        "oauth.activity.downloaded",
        OnActivityDownloaded.create(activity.slug),
      );

      // print INFO for created activities
      logger.log(
        `Activity data for "${activity.slug}" ` +
          `downloaded from provider "${activity.provider}"`,
      );

      // populates this activity's *data* in `activityData`
      await this.onSuccessActivityUpdate(
        activity,
        activityData as ActivityDataDocument,
      );
      return;
    } catch (e: any) {
      // @todo print error message in persistent log such that it can be investigated
      // this activity's processing state updates to `-1`
      this.onError(
        logger,
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
   * Helper method that executes error handling. It prints the error
   * message in the logs and updates the `activities` document's
   * `processingState` field to {@link ProcessingState.Failed}.
   *
   * @access private
   * @async
   * @param   {LogService}        logger      A logger instance to use only one and the same.
   * @param   {ActivityDocument}  activity    The activity that produced an error.
   * @param   {string}            message     The error message.
   * @param   {string}            stack       (Optional) An optional error stack trace.
   * @returns {Promise<void>}
   */
  private async onError(
    logger: LogService,
    activity: ActivityDocument,
    message: string,
    stack?: string,
  ): Promise<void> {
    //@todo print error message in persistent log such that it can be investigated
    if (undefined === stack) {
      logger.error(message);
    } else logger.error(message, stack);

    // this activity's processing state updates to `-1`
    await this.onFailureActivityUpdate(activity);
  }

  /**
   * Helper method that executes a database update of the `activities`
   * document's `processingState` field to {@link ProcessingState.Failed}.
   * <br /><br />
   * This method is called internally *on failure* of the activity
   * details download process.
   *
   * @access private
   * @async
   * @param   {ActivityDocument}  activity    The activity that produced an error.
   * @returns {Promise<ActivityDocument>}   The updated `activities` document.
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
   * Helper method that executes a database update of the `activities`
   * document's `processingState` field to {@link ProcessingState.Processed}.
   * <br /><br />
   * This method is called internally *on success* of the activity
   * details download process.
   *
   * @access private
   * @async
   * @param   {ActivityDocument}      activity        The activity document that is being updated.
   * @param   {ActivityDataDocument}  activityData    The activity *data* document that will be attached to the activity.
   * @returns {Promise<ActivityDocument>}   The updated `activities` document.
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
}
