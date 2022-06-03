/**
 * This file is part of dHealth dApps Framework shared under LGPL-3.0
 * Copyright (C) 2022-present dHealth Network, All rights reserved.
 *
 * @package     dHealth dApps Framework
 * @subpackage  Backend
 * @author      dHealth Network <devs@dhealth.foundation>
 * @license     LGPL-3.0
 */
jest.mock('@dhealth/sdk');

const forRootCall = jest.fn(() => ConfigModuleMock);
const ConfigModuleMock = { forRoot: forRootCall };
jest.mock('@nestjs/config', () => {
  return { ConfigModule: ConfigModuleMock };
});

const DiscoveryModuleMock = jest.fn();
jest.mock('src/discovery/discovery.module', () => {
  return { DiscoveryModule: DiscoveryModuleMock };
});

const PayoutModuleMock = jest.fn();
jest.mock('src/payout/payout.module', () => {
  return { PayoutModule: PayoutModuleMock };
});

const ProcessorModuleMock = jest.fn();
jest.mock('src/processor/processor.module', () => {
  return { ProcessorModule: ProcessorModuleMock };
});

const SchedulerModuleMock = jest.fn();
jest.mock('src/scheduler/scheduler.module', () => {
  return { SchedulerModule: SchedulerModuleMock };
});

const mongooseForRootCall = jest.fn(() => MongooseModuleMock);
const MongooseModuleMock = { forRoot: mongooseForRootCall };
jest.mock('@nestjs/mongoose', () => {
  return { MongooseModule: MongooseModuleMock };
});

const AccountsModuleMock = jest.fn();
jest.mock('src/common/modules/routes/accounts/accounts.module', () => {
  return { AccountsModule: AccountsModuleMock };
});

const AddAccountsModuleMock = jest.fn();
jest.mock(
  'src/common/modules/cronjobs/add-accounts/add-accounts.module',
  () => {
    return { AddAccountsModule: AddAccountsModuleMock };
  },
);

import { Imports } from '.';

describe('Imports', () => {
  describe('test on getImports()', () => {
    it('should return correct result for non-scheduler', () => {
      const configDto = {
        scheduler: [],
        scopes: ['discovery', 'payout', 'processor', 'scheduler'],
      };
      const expectedResult = [
        ConfigModuleMock,
        DiscoveryModuleMock,
        PayoutModuleMock,
        ProcessorModuleMock,
      ];
      const result = Imports.getImports(configDto);
      expect(result).toEqual(expectedResult);
    });

    it('should return correct result for non-scheduler with disabled modules', () => {
      const configDto = {
        scheduler: [],
        scopes: ['discovery', 'processor', 'scheduler'],
      };
      const expectedResult = [
        ConfigModuleMock,
        DiscoveryModuleMock,
        ProcessorModuleMock,
      ];
      const result = Imports.getImports(configDto);
      expect(result).toEqual(expectedResult);
    });

    it('should return correct result for scheduler', () => {
      const configDto = {
        scheduler: ['addAccounts'],
        scopes: ['scheduler'],
      };
      const expectedResult = [
        ConfigModuleMock,
        MongooseModuleMock,
        AddAccountsModuleMock,
      ];
      const result = Imports.getImports(configDto, true);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('test on getConfigFunction()', () => {
    it('should return correct result', () => {
      const configDto = {
        scheduler: ['addAccounts'],
        scopes: ['discovery', 'payout', 'processor', 'scheduler'],
      };
      Imports.configDTO = configDto;
      const result = Imports.getConfigFunction();
      expect(result).toEqual(configDto);
    });
  });
});
