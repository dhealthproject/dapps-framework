/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend Configuration
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
/**
 * @label CONFIG
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
export default () => ({
  /**
   * A mail transport method configuration field. This includes connection
   * and mailing details such as host, port, user, and password. This field
   * also includes a default `"from"` email address which in which emails
   * will be sent from.
   *
   * @example `{host: "example.com", port: 587, user: "user@example.com", password: "test-pass", from: "from.address@example.com"}`
   * @see TransportConfig
   * @var {TransportConfig}
   */
  mailer: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.FROM,
  },
});