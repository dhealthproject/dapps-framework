/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @label EVENTS
 * @class OnActivityCreated
 * @description An event class that is attached to *emitted events* as a payload
 * for events with the name `processor.activities.created`.
 * <br /><br />
 * This class can also be used to implement the event emitter.
 * <br /><br />
 * Parameters:
 * | Name | Type | Description |
 * | --- | --- | --- |
 * | `slug` | `string` | The activity's slug as described in {@link Activity}. |
 *
 * @since v0.3.2
 */
export class OnActivityCreated {
  /**
   *
   */
  public slug: string;

  /**
   *
   */
  public static create(data: any): OnActivityCreated {
    // creates instance and fill
    const event = new OnActivityCreated();
    event.slug = data["slug"] ?? undefined;

    // returns prepared
    return event;
  }
}
