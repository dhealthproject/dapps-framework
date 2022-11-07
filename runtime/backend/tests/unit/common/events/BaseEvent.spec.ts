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
import { Test } from "@nestjs/testing";

// internal dependencies
import { BaseEvent } from "../../../../src/common/events/BaseEvent";


class TestEvent extends BaseEvent {}

describe("common/BaseEvent", () => {
  let event: BaseEvent;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TestEvent,
      ]
    }).compile();

    event = module.get<BaseEvent>(TestEvent);
  });

  it("should be defined", () => {
    expect(event).toBeDefined();
  });
});