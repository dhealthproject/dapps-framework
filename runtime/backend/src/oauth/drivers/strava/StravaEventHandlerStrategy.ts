// external dependencies
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { EventEmitter2 } from "@nestjs/event-emitter";
import moment from "moment";

// internal dependencies
import { Activity, ActivityDocument, ActivityModel, ActivityQuery } from "../../../users/models/ActivitySchema";
import { EventHandlerStrategy } from "../EventHandlerStrategy";
import { StravaWebHookEventRequest } from "./StravaWebHookEventRequest";
import { ActivitiesService } from "../../../users/services/ActivitiesService";
import { QueryService } from "../../../common/services/QueryService";
import { OnActivityCreated } from "../../events/OnActivityCreated";
import { LogService } from "../../../common/services/LogService";
import { AppConfiguration } from "../../../AppConfiguration";
import { BasicWebHookEventRequest } from "../BasicWebHookEventRequest";

@Injectable()
export class StravaEventHandlerStrategy implements EventHandlerStrategy {
  constructor(
    @InjectModel(Activity.name)
    private readonly model: ActivityModel,
    private readonly activitiesService: ActivitiesService,
    private readonly queryService: QueryService<ActivityDocument, ActivityModel>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  /**
   * This method handles incoming **events** from third-party
   * data providers, in this case Strava.
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
   * @param     {BasicWebHookEventRequest}    data          The activity's **headers**. Importantly, Strava does not share full activity details here.
   * @returns   {Promise<ActivityDocument>}   The created document that was added to `activities`.
   * @throws    {Error}                       Given invalid event payload, incompatible event payload or given any other error occurs while processing.
   * @emits     {@link OnActivityCreated}     Given a successful activity creation (processing success).
   */
  async eventHandler(
    providerName: string,
    userAddress: string,
    data: BasicWebHookEventRequest
  ): Promise<ActivityDocument> {
    // destructure obligatory fields for validation
    const { object_type, object_id, aspect_type, owner_id, event_time } = data as StravaWebHookEventRequest;

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
}