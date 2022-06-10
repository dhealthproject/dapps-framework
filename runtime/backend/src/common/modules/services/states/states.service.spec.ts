/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { StateDto } from 'src/common/models';
import { StatesService } from './states.service';

describe('StatesService', () => {
  let service: StatesService;

  const findOneCall = jest.fn(() => ({ exec: () => ({}) }));
  const saveOneCall = jest.fn(() => ({ exec: () => ({}) }));
  class MockModel {
    static findOne = findOneCall;
    static findOneAndUpdate = saveOneCall;
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatesService,
        {
          provide: getModelToken('State'),
          useValue: MockModel,
        },
      ],
    }).compile();

    service = module.get<StatesService>(StatesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('test on findOne()', () => {
    it('should call findOne() from model with correct param', async () => {
      const query = {};
      await service.findOne(query);
      expect(findOneCall).toBeCalledWith(query);
    });
  });

  describe('test on updateOne()', () => {
    it('should call updateOne() from model with correct param', async () => {
      const stateDto: StateDto = {
        name: 'test',
        data: {},
      };
      const expectedQuery = { name: stateDto.name };
      await service.updateOne(stateDto);
      expect(saveOneCall).toBeCalledWith(expectedQuery, stateDto, {
        upsert: true,
      });
    });
  });
});
