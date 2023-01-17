// external dependencies
import { Injectable } from "@nestjs/common";

// internal dependencies
import { EventHandlerStrategy } from "./EventHandlerStrategy";
import { StravaEventHandlerStrategy } from "./strava/StravaEventHandlerStrategy";

@Injectable()
export class EventHandlerStrategyFactory {
  constructor(
    private readonly stravaEventHandlerStrategy: StravaEventHandlerStrategy,
  ) {}

  public create(providerName: string): EventHandlerStrategy {
    switch (providerName) {
      case "strava":
        return this.stravaEventHandlerStrategy;
    }
  }
}
