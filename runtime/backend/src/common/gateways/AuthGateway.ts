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
import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayInit,
  OnGatewayDisconnect,
} from "@nestjs/websockets";
import { IncomingMessage, ServerResponse } from "http";
import { Server } from "https";

// internal dependencies
import { BaseGateway } from "./BaseGateway";
import dappConfigLoader from "../../../config/dapp";

const dappConfig = dappConfigLoader();
@WebSocketGateway(80, {
  namespace: `${dappConfig.dappName}`,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export class AuthGateway
  extends BaseGateway
  implements 
    OnGatewayConnection,
    OnGatewayInit,
    OnGatewayDisconnect
{
  @WebSocketServer()
  protected server: Server;

  @SubscribeMessage("auth.open")
  handleEvent(@MessageBody() message: any) {
    console.log("AUTHGATEWAY: Connection open");
    return { msg: "You're connected" };
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
  ) {
    console.log("FRONTEND CLIENT CONNECTED");
  }

  handleDisconnect(client: any) {
    console.log("BASEGATEWAY: Client disconnected");
  }

  afterInit(server: Server) {
    console.log("AUTHGATEWAY INITIALIZED");
  }
}
