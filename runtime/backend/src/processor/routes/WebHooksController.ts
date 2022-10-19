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
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  Response as NestResponse,
} from "@nestjs/common";
import {
  ApiExtraModels,
  ApiOperation,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import { Response } from "express";

// internal dependencies
import { OAuthService } from "../../common/services/OAuthService";
import { WebHooksService } from "../services/WebHooksService";

// @todo this needs another abstraction layer to permit multi-providers
// @todo should instead be moved in OAuthService and use available drivers
import { StravaWebHookEventRequest } from "../../common/drivers/strava/StravaWebHookEventRequest";
import { StravaWebHookSubscriptionRequest } from "../../common/drivers/strava/StravaWebHookSubscriptionRequest";
import { StravaWebHookSubscriptionResponse } from "../../common/drivers/strava/StravaWebHookSubscriptionResponse";

namespace HTTPResponses {
  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of GET `/webhook/:provider`
  export const WebhookGetResponseSchema = {
    schema: {
      type: getSchemaPath(StravaWebHookSubscriptionResponse),
    },
  };

  // creates a variable that we include in a namespace
  // and configure the OpenAPI schema for the response
  // maps to the HTTP response of POST `/webhook/:provider`
  export const WebhookPostResponseSchema = {
    schema: {
      type: "string",
      example: "EVENT_RECEIVED",
    },
  };
}

/**
 * @label PROCESSOR
 * @class WebHooksController
 * @description The web hooks controller of the app. Handles requests
 * that are issued from *third-party data providers* such as Strava or
 * Apple Health.
 * <br /><br />
 * This controller defines the following routes:
 * | URI | HTTP method | Class method | Description |
 * | --- | --- | --- | --- |
 * | `/webhook/:provider` | **`GET`** | {@link WebHooksController.subscribe} | Accepts a `hub` in the request query that must contain fields: `verify_token` and `challenge`. Responds with the *challenge* as attached to the request only if the verification token is valid. |
 * | `/webhook/:provider` | **`POST`** | {@link WebHooksController.event} | Accepts an *activity object* in the request body and uses it to *store the activity headers* as attached in the request. |
 * <br /><br />
 *
 * @since v0.3.2
 */
@ApiTags("Web Hooks")
@Controller("webhook")
export class WebHooksController {
  /**
   * Constructs an instance of this controller.
   *
   * @constructor
   * @param   {OAuthService} oauthService
   * @param   {WebHooksService} webhooksService
   */
  constructor(
    private readonly oauthService: OAuthService,
    private readonly webhooksService: WebHooksService,
  ) {}

  /**
   * This endpoint is called by third-party data providers to initially
   * create webhook subscriptions for remote accounts.
   * <br /><br />
   * This endpoint is *secured* by a provider *verification token* that
   * must be attached to the request and that must match the runtime's
   * configuration.
   *
   * @method GET
   * @access protected
   * @async
   * @param   {Response}                    response      An `express` response object that will be used to attach the challenge when verification succeeds.
   * @param   {string}                      providerName  A third-party data provider name, e.g. `"strava"`.
   * @param   {StravaWebHookSubscriptionRequest}  query         A webhook subscription request query. This consists of a platform-dependent fields list (see Strava).
   * @returns Promise<Response>   An `express` response object that contains the verification challenge as attached in the request.
   * @throws  {HttpException}     Given an *invalid* verification token or no verification token is present.
   */
  @Get(":provider")
  @ApiOperation({
    summary: "Provider webhook subscription (Step 1)",
    description:
      "This endpoint is called by third-party data providers to initially create webhook subscriptions for remote accounts.",
  })
  @ApiExtraModels(
    StravaWebHookSubscriptionRequest,
    StravaWebHookSubscriptionResponse,
  )
  @ApiOkResponse(HTTPResponses.WebhookGetResponseSchema)
  protected async subscribe(
    @NestResponse() response: Response,
    @Param("provider") providerName: string,
    @Query("hub.challenge") challenge: string,
    @Query("hub.verify_token") verify_token: string,
  ): Promise<Response> {
    // uses verify token to protect this endpoint
    if (undefined === verify_token || !verify_token.length) {
      throw new HttpException(`Bad Request`, 400);
    }

    try {
      // first make sure we have a compatible provider
      const provider = this.oauthService.getProvider(providerName);

      // verifies that the `verify_token` from Strava is
      // the correct one as defined by the runtime configuration
      if (verify_token !== provider.verify_token) {
        // @todo should log as "malicious" subscription attempt
        throw new HttpException(`Unauthorized`, 401);
      }

      // SUCCESS, echo back the challenge
      return response.status(200).json({
        "hub.challenge": challenge,
      });
    } catch (e) {
      throw new HttpException(`Bad Request`, 400);
    }
  }

  /**
   * This endpoint is called by third-party data providers to create or
   * update events for remote accounts, e.g. upon activity completion.
   *
   * @method GET
   * @access protected
   * @async
   * @param   {Response}                    response      An `express` response object that will be used to attach the challenge when verification succeeds.
   * @returns
   */
  @Post(":provider")
  @ApiOperation({
    summary: "Provider webhook events (Step 2)",
    description:
      "This endpoint is called by third-party data providers to create or update events for remote accounts, e.g. upon activity completion.",
  })
  @ApiOkResponse(HTTPResponses.WebhookPostResponseSchema)
  protected async event(
    @NestResponse() response: Response,
    @Param("provider") providerName: string,
    @Body() data: StravaWebHookEventRequest,
  ) {
    // shortcuts to messages that are responded
    const IGNORE_MESSAGE = "EVENT_IGNORED";
    const SUCCESS_MESSAGE = "EVENT_RECEIVED";

    console.log("[DEBUG][WebHooksController] Receive webhook event with data: ", data);

    try {
      // first make sure we have a compatible provider
      const provider = this.oauthService.getProvider(providerName);

      // also make sure the forwarded activity is that
      // of a *known* end-user (athlete) in our database
      const integration = await this.oauthService.getIntegrationByRemoteIdentifier(
        providerName,
        data.owner_id,
      );

      // ignore this event given no integration or client_id
      if (null === integration || !provider.client_id) {
        // CAUTION: do not respond with status code different
        // from 200, otherwise data providers will re-send req
        return response.status(200).send(IGNORE_MESSAGE);
      }

      console.log("[DEBUG][WebHooksController] Found accountintegrations entry.");

      // creates the activity using the webhook *event handler*
      await this.webhooksService.eventHandler(
        providerName,
        integration.address,
        data,
      );

      console.log("[DEBUG][WebHooksController] Event handler executed successfully.");

      // responds with status 200 and success message
      return response.status(200).send(SUCCESS_MESSAGE);
    } catch (e) {
      console.log("[DEBUG][WebHooksController][ERROR] An error happened with the webhook event: ", e);
      // CAUTION: do not respond with status code different
      // from 200, otherwise data providers will re-send req
      return response.status(200).send(IGNORE_MESSAGE);
    }
  }
}
