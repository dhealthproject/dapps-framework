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
 * @class OnAuthClosed
 * @description An event class that is attached to *emitted events* as a payload
 * for events with the name `auth.open`.
 * <br /><br />
 * This class can also be used to implement the event emitter.
 * <br /><br />
 * Parameters:
 * | Name | Type | Description |
 * | --- | --- | --- |
 * | `challenge` | `string` | The authentication challenge. |
 *
 * @since v0.6.0
 */
export class OnAuthClosed {
  /**
   * Contains the **authentication challenge** which consists in a unique
   * identifier that relates to the operation of authenticating the user.
   *
   * @access public
   * @var {string}
   */
  public challenge: string;

  /**
   * Static helper method that creates an instance of this event class.
   * <br /><br />
   * This method can/shall be used whenever an event is *emitted*
   * by the runtime, or whenever an event is being *listened to*.
   *
   * @access public
   * @static
   * @param   {string}    challenge    The unique authentication challenge.
   * @returns {OnAuthClosed}   The prepared event (which can be emitted).
   */
  public static create(challenge: string): OnAuthClosed {
    // creates instance and fill
    const event = new OnAuthClosed();
    event.challenge = challenge;

    // returns prepared
    return event;
  }
}
