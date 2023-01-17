// internal dependencies
import { ActivityDocument } from "../../users/models/ActivitySchema";
import { BasicWebHookEventRequest } from "./BasicWebHookEventRequest";

export interface EventHandlerStrategy {
  eventHandler(
    providerName: string,
    userAddress: string,
    data: BasicWebHookEventRequest,
  ): Promise<ActivityDocument>;
}
