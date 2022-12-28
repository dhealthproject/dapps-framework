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
import cookie from "cookie";
import cookieParser from "cookie-parser";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { Socket } from "dgram";
import { HttpException, HttpStatus } from "@nestjs/common";

// internal dependencies
import dappConfigLoader from "../../../config/dapp";
import { LogService } from "../services";

const dappConfig = dappConfigLoader();

/**
 * @label COMMON
 * @class BaseGateway
 * @description This class serves as the *base class* for
 * custom gateways which are connecting with the client through the websocket.
 * <br /><br />
 * This class can be used by extending it and adding different
 * @SubscribeMessage handlers.
 *
 * @since v0.2.0
 */
@WebSocketGateway(80, {
  path: "/ws",
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export abstract class BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  /**
   * Construct an instance of the base gateway,
   * initialize clients, logger and emitter properties.
   *
   * @access public
   * @param   {EventEmitter2}      emitter     Emitting events once connections/updates appear.
   * @param   {Array}              clients     Store connected client challenges.
   * @param   {LogService}         logger      Log important data to console or files based on configuration.
   */
  constructor(protected readonly emitter: EventEmitter2) {
    this.clients = [];
    this.logger = new LogService(`${dappConfig.dappName}/gateway`);
  }

  /**
   * This property permits to log information to the console or in files
   * depending on the configuration. This logger instance can be accessed
   * by extending listeners to use a common log process.
   *
   * @access protected
   * @var {LogService}
   */
  protected logger: LogService;

  /**
   * This property implements gateway server
   * which is broadcasts different messages to single or multiple clients.
   *
   * @access protected
   * @var {Server}
   */
  @WebSocketServer()
  server: Server;

  /**
   * This property implements list of currently connected
   * clients by storing their challenges. Challenge gets removed from list once client disconnects.
   *
   * @access protected
   * @var {string[]}
   */
  protected clients: string[];

  /**
   * This property stores socket instance which
   * is getting assigned in it on connection. Used for sending messages/emitting events from child classes.
   *
   * @access protected
   * @var {Socket}
   */
  protected ws: Socket;

  /**
   * This method handles connection via websocket with the client.
   * It also extracts challenge cookie from request, decodes it and stores in clients list.
   * <br /><br />
   * In case of a *successful* challenge decoding "auth.open" event will be fired.
   *
   * @param   {any}  ws       Websocket connection param, holds server and client info.
   * @param   {any}  req      Request param which allows to access cookies
   * @returns {Promise<void>}  Emits "auth.open" event which triggers validating of the received challenge
   * @throws  {HttpException}  Challenge wasn't attached to request cookies
   */
  async handleConnection(ws: any, req: any) {
    // parse challenge from cookie
    const c: any = cookie.parse(req.headers.cookie);
    const decoded = cookieParser.signedCookie(
      decodeURIComponent(c.challenge),
      process.env.SECURITY_AUTH_TOKEN_SECRET,
    ) as string;

    // if challenge couldn't be parsed or parsed incorrectly - throw an error
    if (!decoded)
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);

    // store ws connection to allow send messages to the client in child classes
    this.ws = ws;

    // add cookie to ws object
    ws.challenge = decoded;
    // push challenge to client list
    this.clients.push(decoded);

    // trigger auth.open event with challenge passed
    this.emitter.emit("auth.open", { challenge: decoded });

    this.logger.log("client connected", this.clients);
  }

  /**
   * This method handles closing connection with the client.
   * After client was disconnected - remove his challenge from list.
   * <br /><br />
   * In case of a *successful* validation attempts, i.e. when the `challenge`
   * parameter **has been found** in a recent transfer transaction's message,
   * a document will be *insert* in the collection `authChallenges`.
   *
   * @param   {any}  ws       Websocket connection param, holds server and client info.
   * @returns {void}          Removes client challenge from list
   */
  handleDisconnect(ws: any) {
    const str = ws.challenge;
    this.clients = this.clients.filter((c) => c !== str);

    this.logger.log("Client disconnected", this.clients);
  }

  /**
   * This method handles gateway initialize hook.
   *
   * @param   {Server}  server       Websocket connection param, holds server and client info.
   * @returns {void}                 Removes client challenge from list
   */
  afterInit(server: Server) {
    this.logger.log("Gateway initialized");
  }
}
