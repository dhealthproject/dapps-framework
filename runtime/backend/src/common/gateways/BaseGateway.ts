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

  public validationInterval: any = null;

  @WebSocketServer()
  protected server: any;

  protected clients: string[];

  async handleConnection(ws: any, req: any) {
    // const challenge = this.getChallengeFromUrl(client);
    // this.clients.push(challenge);
    const cookies = req.headers.cookie.split(";");
    const challenge = cookies.find((cookie: string) =>
      cookie.trim().includes("challenge"),
    );

    this.clients.push(challenge.split("=")[1]);
    ws.challenge = challenge;

    ws.emit("received_challenge", { challenge });

    console.log("client connected", this.clients);
    this.performValidation(challenge.split("=")[1], ws);

    // console.log("cookie: ", req.headers);
  }

  performValidation(challenge: string, client: any) {
    this.validationInterval = setInterval(async () => {
      try {
        const isValid = await this.authService.validateChallenge(challenge);
        console.log({ address: isValid.address });

        if (isValid.address) {
          client.send("allowed_authentication");
          clearInterval(this.validationInterval);
        }
      } catch (err) {
        console.log({ isValid: false });
      }
    }, 10000);
  }

  handleDisconnect(ws: any) {
    // const challenge = this.getChallengeFromUrl(client);
    console.log("BASEGATEWAY: Client disconnected");
    const str = ws.challenge.split("=")[1];
    this.clients = this.clients.filter((c) => c !== str);
    console.log("disconnect: ", this.clients);
    clearInterval(this.validationInterval);

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
