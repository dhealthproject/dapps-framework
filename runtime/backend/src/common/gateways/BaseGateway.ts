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
import { JwtService } from "@nestjs/jwt";

// internal dependencies
import dappConfigLoader from "../../../config/dapp";
import { AuthService } from "../services";

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
  constructor(private readonly authService: AuthService) {
    this.clients = [];
  }

  @WebSocketServer()
  protected server: Server;

  protected clients: string[];

  handleConnection(ws: any, req: any) {
    // const challenge = this.getChallengeFromUrl(client);
    // this.clients.push(challenge);
    console.log("client connected", this.authService.getCookie());
    const str = req.headers.cookie.split("=")[1];
    console.log("DECODED ???????????", decodeURIComponent(str.split(".")[1]));

    ws.cookie = req.headers.cookie;

    // console.log("cookie: ", req.headers);
  }

  handleDisconnect(ws: any) {
    // const challenge = this.getChallengeFromUrl(client);
    console.log("BASEGATEWAY: Client disconnected");
    console.log("disconnect: ", ws.cookie);

    // this.clients = this.clients.filter(
    //   (clientId) => clientId !== server.client.id,
    // );
  }

  afterInit(server: Server) {
    console.log("GATEWAY INITIALIZED");
  }

  protected getChallengeFromUrl(client: any) {
    const { url } = client;
    const challenge = url.split("=")[1];

    return challenge;
  }
}
