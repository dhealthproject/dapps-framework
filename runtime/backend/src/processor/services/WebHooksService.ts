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
import { EventEmitter2 } from "@nestjs/event-emitter";
import dayjs from "dayjs";

// internal dependencies
import { StravaWebHookEventRequest } from "../../common/drivers/strava/StravaWebHookEventRequest";
import { QueryService } from "../../common/services/QueryService";
import {
  Activity,
  ActivityDocument,
  ActivityModel,
  ActivityQuery,
} from "../models/ActivitySchema";

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

    console.log("[DEBUG][WebHooksService] Now handling event with payload: ", data);

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
        OnActivityCreated.create(activity),
      );

      // returns the created `ActivityDocument`
      return activity;
    } catch (err: any) {
      throw new Error(
        `An error occurred while handling event ${object_id}: ${err}`,
      );
    }
  }
}
