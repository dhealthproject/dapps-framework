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
import { HttpException, HttpStatus } from "@nestjs/common";
import { Request } from "express";

// internal dependencies
import { LogService } from "../services/LogService";
import { OnAuthOpened } from "../events/OnAuthOpened";

// configuration resources
import dappConfigLoader from "../../../config/dapp";
const dappConfig = dappConfigLoader();

/**
 * @type WebsocketConsumerMap
 * @description Contains a labelled map of connected websocket clients. The
 * value always contains a *connected* `Socket` instance that is used to
 * interact with UDP datagram sockets.
 *
 * @since v0.6.0
 */
export type WebsocketConsumerMap = { [id: string]: any };

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
@WebSocketGateway({
  // note: empty port runs the websocket server on same port as HTTP
  path: "/ws",
  cors: {
    origin: process.env.FRONTEND_URL,
  },
})
export abstract class BaseGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
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
  protected server: Server;

  /**
   * This property implements list of currently connected
   * clients by storing their challenges. Challenge gets removed from list once client disconnects.
   *
   * @access protected
   * @var {WebsocketConsumerMap}
   */
  protected clients: WebsocketConsumerMap;

  /**
   * Contains the full websocket connection URL (including path).
   *
   * @access protected
   * @var {string}
   */
  protected websocketUrl: string;

  /**
   *
   */
  protected options: {
    debug: boolean;
  } = {
    debug: dappConfig.debugMode === true,
  };

  /**
   * Construct an instance of the base gateway,
   * initialize clients, logger and emitter properties.
   *
   * @access public
   * @param   {EventEmitter2}      emitter     Emitting events once connections/updates appear.
   * @param   {Array}              clients     Store connected client challenges.
   */
  public constructor(protected readonly emitter: EventEmitter2) {
    this.clients = {};
    this.logger = new LogService(`${dappConfig.dappName}`);

    // build URL from configuration
    const scheme = dappConfig.backendApp.https ? `wss` : `ws`;
    const wsHost = dappConfig.backendApp.host;
    const wsPort = dappConfig.backendApp.wsPort;

    // note that for HTTPS enabled backend runtimes,
    // the websocket connection works with `wss://`
    this.websocketUrl = `${scheme}://${wsHost}:${wsPort}/ws`;
  }

  /**
   * This method handles connection via websocket with the client.
   * <br /><br />
   * Additionally, this method will *emit* the event `auth.open` given the
   * presence of an *authentication challenge* in the *signed request cookies*.
   *
   * @access public
   * @param   {any}  ws        UDP datagrap socket used to connect.
   * @param   {Request}  req      HTTP Request forwarded to enable reading signed client cookies.
   * @returns {Promise<void>}
   * @emits   {@link OnAuthOpened}     Given the presence of a challenge in signed cookies of the *request*.
   * @throws  {HttpException}  Given a missing or invalid challenge in the signer cookies of the *request*.
   */
  public async handleConnection(ws: any, req: Request) {
    let c;
    let challenge;
    // parse challenge from cookie
    try {
      c = cookie.parse(req.headers.cookie);
      challenge = cookieParser.signedCookie(
        decodeURIComponent(c.challenge),
        process.env.SECURITY_AUTH_TOKEN_SECRET,
      ) as string;
    } catch (err) {
      challenge = req.url.split("=")[1];

      console.log("Error handleConnection()", err);
    }

    // if challenge couldn't be parsed or parsed incorrectly - throw an error
    if (!challenge) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
    }

    // add cookie to ws object and push challenge to client list
    // the challenge is used as a "websocket client identifier"
    ws.challenge = challenge;
    this.clients[challenge] = ws;

    // internal event emission
    this.emitter.emit("auth.open", OnAuthOpened.create(challenge));

    if (this.options.debug === true) {
      this.logger.debug(
        `New websocket client connected with challenge "${challenge}"`,
      );
    }
  }

  /**
   * This method handles closing connection with the client.
   * After client was disconnected - remove his challenge from list.
   * <br /><br />
   * In case of a *successful* validation attempts, i.e. when the `challenge`
   * parameter **has been found** in a recent transfer transaction's message,
   * a document will be *insert* in the collection `authChallenges`.
   *
   * @access public
   * @param   {any}  ws       Websocket connection param, holds server and client info.
   * @returns {void}          Removes client challenge from list
   */
  public handleDisconnect(ws: any) {
    // do we have a challenge?
    if (!("challenge" in ws) || !ws.challenge.length) {
      return;
    }

    // is it a connected client?
    if (!(ws.challenge in this.clients)) {
      return;
    }

    // client is now disconnected
    delete this.clients[ws.challenge];
  }

  /**
   * This method handles gateway initialize hook.
   *
   * @access public
   * @param   {Server}  server       Websocket connection param, holds server and client info.
   * @returns {void}                 Removes client challenge from list
   */
  public afterInit(server: Server) {
    // log about websocket availability
    this.logger.debug(
      `Now listening for websocket connections on ${this.websocketUrl}`,
    );

    if (server.connections !== undefined) {
      this.logger.debug(`${server.connections} websocket clients connected`);
    }
  }
}
