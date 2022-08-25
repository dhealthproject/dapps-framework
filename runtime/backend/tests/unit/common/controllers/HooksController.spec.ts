/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */

// internal dependencies
import { ConfigService } from "@nestjs/config";

// external dependencies
import { HooksController } from "../../../../src/common/routes/HooksController";
import { HooksService } from "../../../../src/common/services/HooksService";

// const configForRootCall: any = jest.fn(() => ConfigServiceMock);
// const ConfigServiceMock: any = { get: configForRootCall };
// jest.mock("@nestjs/config", () => {
//   return { ConfigService: () => ConfigServiceMock };
// });

describe("HooksController", () => {
  let hooksController: HooksController;
  let hooksService: HooksService;

  beforeEach(() => {
    hooksService = new HooksService();
    hooksController = new HooksController(hooksService);
  });

  describe("createUpdateActivities()", () => {
    it("should return array with activities", () => {
      expect(
        hooksService.createUpdateActivities({
          object_type: "activity",
          object_id: "1",
          aspect_type: "create",
          owner_id: "NATZJE-TZTZCG-GRBUYV-QRBEUF-N5LEGD-RSTNF2-GYA",
        }),
      ).toBe([
        {
          address: "NATZJE-TZTZCG-GRBUYV-QRBEUF-N5LEGD-RSTNF2-GYA",
          athleteId: "1122",
          activityId: "1",
          isProcessed: false,
          isConfirmed: false,
          rewardDay: "20220825",
          referrerAddress: null,
          activityAt: "2022-08-25 12:30:45 +00:00",
        },
      ]);
    });
  });
});
