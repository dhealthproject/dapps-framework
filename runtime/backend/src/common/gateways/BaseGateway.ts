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
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from "@nestjs/websockets";
import { Server } from "https";

// internal dependencies
import dappConfigLoader from "../../../config/dapp";

const dappConfig = dappConfigLoader();

@WebSocketGateway(80, {
  path: `${dappConfig.dappName}`,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export abstract class BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {
    this.clients = [];
  }

  @WebSocketServer()
  protected server: Server;

  protected clients: string[];

  handleConnection(server: any) {
    console.log("BASEGATEWAY: Client connected");
    this.clients.push(server.client.id);
    console.log({ clients: this.clients });
  }

  handleDisconnect(server: any) {
    console.log("BASEGATEWAY: Client disconnected");
    this.clients = this.clients.filter(
      (clientId) => clientId !== server.client.id,
    );
  }

  afterInit(server: Server) {
    console.log("GATEWAY INITIALIZED");
  }
}
