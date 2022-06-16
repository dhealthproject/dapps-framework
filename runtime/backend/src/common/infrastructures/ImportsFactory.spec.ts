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

const forRootCall: any = jest.fn(() => ConfigModuleMock);
const ConfigModuleMock: any = { forRoot: forRootCall };
jest.mock('@nestjs/config', () => {
  return { ConfigModule: ConfigModuleMock };
});

const DiscoveryModuleMock: any = jest.fn();
jest.mock('src/discovery/discovery.module', () => {
  return { DiscoveryModule: DiscoveryModuleMock };
});

const PayoutModuleMock: any = jest.fn();
jest.mock('src/payout/payout.module', () => {
  return { PayoutModule: PayoutModuleMock };
});

const ProcessorModuleMock: any = jest.fn();
jest.mock('src/processor/processor.module', () => {
  return { ProcessorModule: ProcessorModuleMock };
});

const SchedulerModuleMock: any = jest.fn();
jest.mock('src/scheduler/scheduler.module', () => {
  return { SchedulerModule: SchedulerModuleMock };
});

const mongooseForRootCall: any = jest.fn(() => MongooseModuleMock);
const MongooseModuleMock: any = { forRoot: mongooseForRootCall };
jest.mock('@nestjs/mongoose', () => {
  return { MongooseModule: MongooseModuleMock };
});

const AccountsModuleMock: any = jest.fn();
jest.mock('src/common/modules/routes/accounts/accounts.module', () => {
  return { AccountsModule: AccountsModuleMock };
});

const AccountsDiscoveryModuleMock: any = jest.fn();
jest.mock(
  'src/common/modules/cronjobs/accounts-discovery/accounts-discovery.module',
  () => {
    return { AccountsDiscoveryModule: AccountsDiscoveryModuleMock };
  },
);

import { ImportsFactory } from './ImportsFactory';

// Mock the imports factory to re-create class instances
// everytime a new test is running. This mock mimics the
// creation of separate ImportsFactory instances.
class MockFactory extends ImportsFactory {
  protected static $_INSTANCE: MockFactory = null;

  static create(configDTO: any): MockFactory {
    return new MockFactory(configDTO);
  }
}

describe('Imports', () => {
  describe('test on getImports()', () => {
    it('should return correct result for non-scheduler', () => {
      const configDto: any = {
        schedulers: [],
        scopes: ['discovery', 'payout', 'processor'],
      };
      const expectedResult = [
        ConfigModuleMock,
        DiscoveryModuleMock,
        PayoutModuleMock,
        ProcessorModuleMock,
      ];
      const result = MockFactory.create(configDto).getScopedImports();
      expect(result).toEqual(expectedResult);
    });

    it('should return correct result for non-scheduler with disabled modules', () => {
      const configDto: any = {
        schedulers: [],
        scopes: ['discovery', 'processor'],
      };
      const expectedResult = [
        ConfigModuleMock,
        DiscoveryModuleMock,
        ProcessorModuleMock,
      ];
      const result = MockFactory.create(configDto).getScopedImports();
      expect(result).toEqual(expectedResult);
    });

    it('should return correct result for scheduler', () => {
      const configDto: any = {
        schedulers: ['accountsDiscovery'],
        scopes: ['scheduler'],
      };
      const expectedResult = [
        ConfigModuleMock,
        MongooseModuleMock,
        AccountsDiscoveryModuleMock,
      ];
      const result = MockFactory.create(configDto).getSchedulerImports();
      expect(result).toEqual(expectedResult);
    });
  });
});
