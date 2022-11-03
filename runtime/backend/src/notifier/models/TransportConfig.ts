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
 * @label NOTIFIER
 * @module TransportConfig
 * @description The dApp transport configuration. This configuration
 * object is used to determine dApp monitoring transport information as
 * listed below:
 * <br /><br />
 * - A mail transport method configuration field. This includes connection
 * and mailing details such as host, port, user, and password. This field
 * also includes a default `"from"` email address which in which emails
 * will be sent from.
 * <br /><br />
 * CAUTION: By modifying the content of this configuration field,
 * *changes* may occur for the application notifier scope and may
 * thereby affect the format, location and content of which
 * notification occurs.
 *
 * @since v0.3.0
 */
export interface TransportConfig {
  mail: MailConfig;
}

/**
 * @label NOTIFIER
 * @interface MailConfig
 * @description The dApp transport email configuration object. This configuration
 * object is used to determine dApp email information.
 * <br /><br />
 * This interface is mainly used **internally** to restrict the configuration
 * values provided to some modules or services and methods.
 *
 * @link MailConfig:NOTIFIER
 * @since v0.3.2
 */
export interface MailConfig {
  host: string;
  port: string | number;
  user: string;
  password: string;
  from: string | undefined;
}
