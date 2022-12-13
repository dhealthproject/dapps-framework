/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
// external dependencies
import { SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";
import { BaseGateway } from "./BaseGateway";

// internal dependencies
import dappConfigLoader from "../../../config/dapp";

const dappConfig = dappConfigLoader();
@WebSocketGateway({
  namespace: `${dappConfig.dappName}`,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export class AuthGateway extends BaseGateway {
  @SubscribeMessage("auth.open")
  open(message: any) {
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

  handleConnection(
    server: Server<typeof IncomingMessage, typeof ServerResponse>,
    client: any,
  ): void {
    console.log("FRONTEND CLIENT CONNECTED");
  }

  afterInit(server: Server) {
    console.log("AUTHGATEWAY INITIALIZED");
  }
}
