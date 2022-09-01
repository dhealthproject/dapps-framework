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

// internal dependencies
import { ActivitiesService } from "../../../../src/discovery/services/ActivitiesService";
import { ActivitiesController } from "../../../../src/discovery/routes/ActivitiesController";
import { QueryService } from "../../../../src/common/services/QueryService";

describe("/activities", () => {
  let controller: ActivitiesController;
  let activitiesService: ActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [ActivitiesService, QueryService],
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
    activitiesService = module.get<ActivitiesService>(ActivitiesService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
