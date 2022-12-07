/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { BaseGateway } from "./BaseGateway";

@WebSocketGateway()
export default class AuthGateway extends BaseGateway {
  @SubscribeMessage("auth.open")
  open() {
    console.log("AUTHGATEWAY: Connection open");
  }

  @SubscribeMessage("auth.close")
  close() {
    console.log("AUTHGATEWAY: Connection closed");
  }

  @SubscribeMessage("auth.complete")
  complete() {
    console.log("AUTHGATEWAY: Complete");
  }
}
