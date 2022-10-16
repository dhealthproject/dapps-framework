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
import { Test, TestingModule } from "@nestjs/testing";
import { getModelToken } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";
import { HttpException } from "@nestjs/common";

// internal dependencies
import { MockModel } from "../../../mocks/global";
import { WebHooksController } from "../../../../src/processor/routes/WebHooksController";
import { OAuthService } from "../../../../src/common/services/OAuthService";
import { WebHooksService } from "../../../../src/processor/services/WebHooksService";
import { QueryService } from "../../../../src/common/services/QueryService";
import { OAuthProviderParameters } from "../../../../src/common/models/OAuthConfig";
import { AccountIntegrationDocument } from "../../../../src/common/models/AccountIntegrationSchema";
import { ActivityDocument } from "../../../../src/processor/models/ActivitySchema";


describe("processor/WebHooksController", () => {
  let controller: WebHooksController;
  let oauthService: OAuthService;
  let webhooksService: WebHooksService;

  let mockReponseCall: any;
  let mockResponse: any;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebHooksController],
      providers: [
        OAuthService,
        WebHooksService,
        ConfigService,
        QueryService,
        {
          provide: getModelToken("AccountIntegration"),
          useValue: MockModel,
        },
        {
          provide: getModelToken("Activity"),
          useValue: MockModel,
        },
      ]
    }).compile();

    controller = module.get<WebHooksController>(WebHooksController);
    oauthService = module.get<OAuthService>(OAuthService);
    webhooksService = module.get<WebHooksService>(WebHooksService);

    mockReponseCall = jest.fn((args) => args);
    mockResponse = {
      status: jest.fn().mockReturnValue({
        json: mockReponseCall,
        send: mockReponseCall,
      }),
    };
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("subscribe()", () => {
    it("should call correct methods and return correct result", async () => {
      // prepare
      const oauthServiceGetProviderCall = jest
        .spyOn(oauthService, "getProvider")
        .mockReturnValue({ verify_token: "test-verify_token" } as OAuthProviderParameters);

      // act
      const result = await (controller as any).subscribe(
        mockResponse,
        "test-providerName",
        { hub: { verify_token: "test-verify_token", challenge: "test-challenge" } },
      );

      // assert
      expect(oauthServiceGetProviderCall).toHaveBeenCalledTimes(1);
      expect(mockReponseCall).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        "hub.challenge": "test-challenge",
      });
    });

    it("should throw error 400 when verify_token is undefined", () => {
      // prepare
      const oauthServiceGetProviderCall = jest
        .spyOn(oauthService, "getProvider")
        .mockReturnValue({ verify_token: "test-verify_token" } as OAuthProviderParameters);

      // act
      const result = (controller as any).subscribe(
        mockResponse,
        "test-providerName",
        { hub: { verify_token: undefined, challenge: "test-challenge" } },
      );

      // assert
      expect(result).rejects.toThrowError(new HttpException(`Bad Request`, 400));
      expect(oauthServiceGetProviderCall).toHaveBeenCalledTimes(0);
      expect(mockReponseCall).toHaveBeenCalledTimes(0);
    });

    it("should throw error 400 when verify_token is not equal to provider's verify_token", () => {
      // prepare
      const oauthServiceGetProviderCall = jest
        .spyOn(oauthService, "getProvider")
        .mockReturnValue({ verify_token: "other-token" } as OAuthProviderParameters);

      // act
      const result = (controller as any).subscribe(
        mockResponse,
        "test-providerName",
        { hub: { verify_token: "test-verify_token", challenge: "test-challenge" } },
      );

      // assert
      expect(result).rejects.toThrowError(new HttpException(`Bad Request`, 400));
      expect(oauthServiceGetProviderCall).toHaveBeenCalledTimes(1);
      expect(mockReponseCall).toHaveBeenCalledTimes(0);
    });
  });

  describe("event()", () => {
    it("should call correct methods and return correct result", async () => {
      // prepare
      const oauthServiceGetProviderCall = jest
        .spyOn(oauthService, "getProvider")
        .mockReturnValue({
          client_id: "test-client_id",
          verify_token: "test-verify_token"
        } as OAuthProviderParameters);
      const oauthServiceGetIntegrationCall = jest
        .spyOn(oauthService, "getIntegration")
        .mockResolvedValue({} as AccountIntegrationDocument);
      const webhooksServiceEventHandler = jest
        .spyOn(webhooksService, "eventHandler")
        .mockResolvedValue({} as ActivityDocument);

      // act
      const result = await (controller as any).event(
        mockResponse,
        "test-providerName",
        {},
      );

      // assert
      expect(oauthServiceGetProviderCall).toHaveBeenCalledTimes(1);
      expect(oauthServiceGetIntegrationCall).toHaveBeenCalledTimes(1);
      expect(webhooksServiceEventHandler).toHaveBeenCalledTimes(1);
      expect(mockReponseCall).toHaveBeenCalledTimes(1);
      expect(result).toBe("EVENT_RECEIVED");
    });

    it("should send IGNORE_MESSAGE when integration is null", async () => {
      // prepare
      const oauthServiceGetProviderCall = jest
        .spyOn(oauthService, "getProvider")
        .mockReturnValue({
          client_id: "test-client_id",
          verify_token: "test-verify_token"
        } as OAuthProviderParameters);
      const oauthServiceGetIntegrationCall = jest
        .spyOn(oauthService, "getIntegration")
        .mockResolvedValue(null);
      const webhooksServiceEventHandler = jest
        .spyOn(webhooksService, "eventHandler")
        .mockResolvedValue({} as ActivityDocument);

      // act
      const result = await (controller as any).event(
        mockResponse,
        "test-providerName",
        {},
      );

      // assert
      expect(oauthServiceGetProviderCall).toHaveBeenCalledTimes(1);
      expect(oauthServiceGetIntegrationCall).toHaveBeenCalledTimes(1);
      expect(webhooksServiceEventHandler).toHaveBeenCalledTimes(0);
      expect(mockReponseCall).toHaveBeenCalledTimes(1);
      expect(result).toBe("EVENT_IGNORED");
    });

    it("should send IGNORE_MESSAGE when client_id doesn't exit", async () => {
      // prepare
      const oauthServiceGetProviderCall = jest
        .spyOn(oauthService, "getProvider")
        .mockReturnValue({
          verify_token: "test-verify_token"
        } as OAuthProviderParameters);
      const oauthServiceGetIntegrationCall = jest
        .spyOn(oauthService, "getIntegration")
        .mockResolvedValue({} as AccountIntegrationDocument);
      const webhooksServiceEventHandler = jest
        .spyOn(webhooksService, "eventHandler")
        .mockResolvedValue({} as ActivityDocument);

      // act
      const result = await (controller as any).event(
        mockResponse,
        "test-providerName",
        {},
      );

      // assert
      expect(oauthServiceGetProviderCall).toHaveBeenCalledTimes(1);
      expect(oauthServiceGetIntegrationCall).toHaveBeenCalledTimes(1);
      expect(webhooksServiceEventHandler).toHaveBeenCalledTimes(0);
      expect(mockReponseCall).toHaveBeenCalledTimes(1);
      expect(result).toBe("EVENT_IGNORED");
    });

    it("should send IGNORE_MESSAGE when there's an error caught", async () => {
      // prepare
      const oauthServiceGetProviderCall = jest
        .spyOn(oauthService, "getProvider")
        .mockReturnValue({
          verify_token: "test-verify_token"
        } as OAuthProviderParameters);
      const oauthServiceGetIntegrationCall = jest
        .spyOn(oauthService, "getIntegration")
        .mockRejectedValue(new Error("test-error"));
      const webhooksServiceEventHandler = jest
        .spyOn(webhooksService, "eventHandler")
        .mockResolvedValue({} as ActivityDocument);

      // act
      const result = await (controller as any).event(
        mockResponse,
        "test-providerName",
        {},
      );

      // assert
      expect(oauthServiceGetProviderCall).toHaveBeenCalledTimes(1);
      expect(oauthServiceGetIntegrationCall).toHaveBeenCalledTimes(1);
      expect(webhooksServiceEventHandler).toHaveBeenCalledTimes(0);
      expect(mockReponseCall).toHaveBeenCalledTimes(1);
      expect(result).toBe("EVENT_IGNORED");
    });
  });
});