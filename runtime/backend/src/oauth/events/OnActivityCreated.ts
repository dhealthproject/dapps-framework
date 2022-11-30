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
 * for events with the name `oauth.activities.created`.
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
   * Contains the **activity slug** which consists of a *unique* field
   * in the `activities` collection. This field can be used to retrieve
   * the activity document.
   *
   * @access public
   * @var {string}
   */
  public slug: string;

  /**
   * Static helper method that creates an instance of this event class.
   * <br /><br />
   * This method can/shall be used whenever an event is *emitted*
   * by the runtime, or whenever an event is being *listened to*.
   *
   * @access public
   * @static
   * @param   {string}    slug    The unique activity slug.
   * @returns {OnActivityCreated}   The prepared event (which can be emitted).
   */
  public static create(slug: string): OnActivityCreated {
    // creates instance and fill
    const event = new OnActivityCreated();
    event.slug = slug;

    // returns prepared
    return event;
  }
}
