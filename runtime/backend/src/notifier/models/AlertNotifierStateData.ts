/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// internal dependencies
import { AlertEvent } from "../../common/events/AlertEvent";
import type { StateData } from "../../common/models/StateData";

/**
 * @class AlertNotifierStateData
 * @description A type that represents data about the
 * state of the **alert notifier** listener.
 * The latest alert data will be persisted so that the
 * next time the alert notifier get called it won't
 * repeatedly send the same notification.
 * <br /><br />
 * Note that we
 * implement the {@link StateData} type to permit more
 * flexibility on gathering module states.
 * <br /><br />
 * This class shall be used mainly to refer and handle
 * data in relation with the **notifier** module.
 *
 * @see ReportNotifier
 * @since v0.3.2
 */
export class AlertNotifierStateData implements StateData {
  /**
   * Contains the details of the last sent alert event of
   * the alert notifier command.
   *
   * @access public
   * @var {number}
   */
  public lastAlertEvent: AlertEvent;
}
