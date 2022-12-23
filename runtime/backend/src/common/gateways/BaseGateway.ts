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
  MessageBody,
} from "@nestjs/websockets";
import { Server } from "https";
import cookie from "cookie";
import cookieParser from "cookie-parser";
import { EventEmitter2 } from "@nestjs/event-emitter";

// internal dependencies
import dappConfigLoader from "../../../config/dapp";
import { LogService } from "../services";

const dappConfig = dappConfigLoader();

@WebSocketGateway(80, {
  path: "/ws",
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export abstract class BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(protected readonly emitter: EventEmitter2) {
    this.clients = [];
    this.logger = new LogService(`${dappConfig.dappName}/gateway`);
  }

  protected logger: LogService;

  @WebSocketServer()
  protected server: any;

  protected clients: string[];

  async handleConnection(ws: any, req: any) {
    // parse challenge from cookie
    const c: any = cookie.parse(req.headers.cookie);
    const decoded = cookieParser.signedCookie(
      decodeURIComponent(c.challenge),
      process.env.SECURITY_AUTH_TOKEN_SECRET,
    ) as string;

    // add cookie to ws object
    ws.challenge = decoded;
    // push challenge to client list
    this.clients.push(decoded);

    // trigger auth.open event with challenge passed
    this.emitter.emit("auth.open", { challenge: decoded });

    this.logger.log("client connected", this.clients);
  }

  handleDisconnect(ws: any) {
    const str = ws.challenge;
    this.clients = this.clients.filter((c) => c !== str);

    this.logger.log("Client disconnected", this.clients);
  }

  afterInit(server: Server) {
    this.logger.log("Gateway initialized");
  }
}
