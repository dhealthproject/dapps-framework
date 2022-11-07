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
import { AccessTokenDTO } from "../../../../src/common/models/AccessTokenDTO";

describe("common/AccessTokenDTO", () => {
  let dto: AccessTokenDTO;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AccessTokenDTO,
      ]
    }).compile();

    dto = module.get<AccessTokenDTO>(AccessTokenDTO);
  });

  it("should be defined", () => {
    expect(dto).toBeDefined();
  });
});