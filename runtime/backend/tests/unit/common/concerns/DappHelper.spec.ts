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
import { BlockHttp } from "@dhealth/sdk";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";

// internal dependencies
import { DappHelper } from "../../../../src/common/concerns/DappHelper";
import { NetworkService } from "../../../../src/common/services/NetworkService";

describe("common/QueryService", () => {
  let service: DappHelper;
  let configService: ConfigService;

  let mockDate: Date;
  beforeEach(async () => {
    mockDate = new Date(1212, 1, 1);
    jest.useFakeTimers("modern");
    jest.setSystemTime(mockDate);

    const module: TestingModule = await Test.createTestingModule({
      providers: [DappHelper, ConfigService, NetworkService],
    }).compile();

    service = module.get<DappHelper>(DappHelper);
    configService = module.get<ConfigService>(ConfigService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getBlockTimestamp() -->", () => {
    it("should have correct flow and result when response is not empty", async () => {
      const getBlockByHeightCall = jest.fn(() => ({
        toPromise: () => Promise.resolve({}),
      }));
      const blockRepository: BlockHttp = {
        getBlockByHeight: getBlockByHeightCall,
      } as any;
      const getNetworkTimestampFromUInt64Call = jest
        .spyOn(service, "getNetworkTimestampFromUInt64")
        .mockReturnValue(1);
      const result = await service.getBlockTimestamp(blockRepository, 1);
      expect(getBlockByHeightCall).toBeCalled();
      expect(getNetworkTimestampFromUInt64Call).toBeCalled();
      expect(result).toEqual(1000);
    });

    it("should throw correct error when response is empty", async () => {
      const getBlockByHeightCall = jest.fn(() => ({
        toPromise: () => Promise.resolve(),
      }));
      const blockRepository: BlockHttp = {
        getBlockByHeight: getBlockByHeightCall,
      } as any;
      const getNetworkTimestampFromUInt64Call = jest
        .spyOn(service, "getNetworkTimestampFromUInt64")
        .mockReturnValue(1);
      await service.getBlockTimestamp(blockRepository, 1).catch((err: Error) => {
        expect(getBlockByHeightCall).toBeCalled();
        expect(getNetworkTimestampFromUInt64Call).toBeCalledTimes(0);
        expect(err.message).toEqual("Cannot query block from height");
      });
    });
  });

  describe("getNetworkTimestampFromUInt64() -->", () => {
    it("should have correct flow and result", () => {
      const timestamp = { compact: () => 1000 };
      const configGetCall = jest.spyOn(configService, "get").mockReturnValue(1);
      const expectedResult = timestamp.compact() / 1000 + 1;
      const result = service.getNetworkTimestampFromUInt64(timestamp as any);
      expect(configGetCall).toBeCalled();
      expect(result).toEqual(expectedResult);
    });
  });

  describe("getTimeRange()", () => {
    it("should return null if periodFormat is not 'D', 'W' or 'Y'", () => {
      // act
      const result = service.getTimeRange("K");

      // assert
      expect(result).toBeNull();
    });

    describe("daily", () => {
      it("should return correct result for normal days in month", () => {
        // prepare
        mockDate = new Date(Date.UTC(2022, 1, 1, 10, 10, 10, 10)); // 01/02/2022 at 10:10:10:010
        jest.setSystemTime(mockDate);

        // act
        const { startDate, endDate } = service.getTimeRange("D");

        // assert
        expect(startDate).toEqual(new Date(Date.UTC(2022, 1, 1))); // 01/02/2022 at 00:00:00:000
        expect(endDate).toEqual(new Date(Date.UTC(2022, 1, 2))); // 02/02/2022 at 00:00:00:000
      });

      it("should return correct result for last day of month", () => {
        // prepare
        mockDate = new Date(Date.UTC(2022, 0, 31, 10, 0)); // 31/01/2022 at 10:00:00:000
        jest.setSystemTime(mockDate);

        // act
        const { startDate, endDate } = service.getTimeRange("D");

        // assert
        expect(startDate).toEqual(new Date(Date.UTC(2022, 0, 31))); // 31/01/2022 at 00:00:00:000
        expect(endDate).toEqual(new Date(Date.UTC(2022, 1, 1))); // 01/02/2022 at 00:00:00:000
      });

      it("should return correct result for last day of year", () => {
        // prepare
        mockDate = new Date(Date.UTC(2022, 11, 31, 10, 0)); // 31/12/2022 at 10:00:00:000
        jest.setSystemTime(mockDate);

        // act
        const { startDate, endDate } = service.getTimeRange("D");

        // assert
        expect(startDate).toEqual(new Date(Date.UTC(2022, 11, 31))); // 31/11/2022 at 00:00:00:000
        expect(endDate).toEqual(new Date(Date.UTC(2023, 0, 1))); // 01/01/2023 at 00:00:00:000
      });
    });

    describe("weekly", () => {
      it("should return correct result for normal weeks", () => {
        // prepare
        mockDate = new Date(Date.UTC(2022, 0, 11, 10, 10, 10, 10)); // Tue 11/01/2022 at 10:10:10:010
        jest.setSystemTime(mockDate);

        // act
        const { startDate, endDate } = service.getTimeRange("W");

        // assert
        expect(startDate).toEqual(new Date(Date.UTC(2022, 0, 10))); // Mon 10/01/2022 at 00:00:00:000
        expect(endDate).toEqual(new Date(Date.UTC(2022, 0, 17))); // Mon 17/01/2022 at 00:00:00:000
      });

      it("should return correct result for weeks that span from last month", () => {
        // prepare
        mockDate = new Date(Date.UTC(2022, 8, 2, 10, 10, 10, 10)); // Fri 02/09/2022 at 10:10:10:010
        jest.setSystemTime(mockDate);

        // act
        const { startDate, endDate } = service.getTimeRange("W");

        // assert
        expect(startDate).toEqual(new Date(Date.UTC(2022, 7, 29))); // Mon 29/08/2022 at 00:00:00:000
        expect(endDate).toEqual(new Date(Date.UTC(2022, 8, 5))); // Mon 05/09/2022 at 00:00:00:000
      });

      it("should return correct result for weeks that span to next month", () => {
        // prepare
        mockDate = new Date(Date.UTC(2022, 8, 27, 10, 10, 10, 10)); // Tue 27/09/2022 at 10:10:10:010
        jest.setSystemTime(mockDate);

        // act
        const { startDate, endDate } = service.getTimeRange("W");

        // assert
        expect(startDate).toEqual(new Date(Date.UTC(2022, 8, 26))); // Mon 26/09/2022 at 00:00:00:000
        expect(endDate).toEqual(new Date(Date.UTC(2022, 9, 3))); // Mon 03/10/2022 at 00:00:00:000
      });

      it("should return correct result for weeks that span from last year", () => {
        // prepare
        mockDate = new Date(Date.UTC(2022, 0, 1, 10, 10, 10, 10)); // Sat 01/01/2022 at 10:10:10:010
        jest.setSystemTime(mockDate);

        // act
        const { startDate, endDate } = service.getTimeRange("W");

        // assert
        expect(startDate).toEqual(new Date(Date.UTC(2021, 11, 27))); // Mon 27/12/2021 at 00:00:00:000
        expect(endDate).toEqual(new Date(Date.UTC(2022, 0, 3))); // Mon 03/01/2022 at 00:00:00:000
      });

      it("should return correct result for weeks that span to next year", () => {
        // prepare
        mockDate = new Date(Date.UTC(2021, 11, 28, 10, 10, 10, 10)); // Tue 28/12/2021 at 10:10:10:010
        jest.setSystemTime(mockDate);

        // act
        const { startDate, endDate } = service.getTimeRange("W");

        // assert
        expect(startDate).toEqual(new Date(Date.UTC(2021, 11, 27))); // Mon 27/12/2021 at 00:00:00:000
        expect(endDate).toEqual(new Date(Date.UTC(2022, 0, 3))); // Mon 03/10/2022 at 00:00:00:000
      });
    });

    describe("monthly", () => {
      it("should return correct result for normal months", () => {
        // prepare
        mockDate = new Date(Date.UTC(2022, 8, 25, 10, 10, 10, 10)); // 25/09/2022 at 10:10:10:010
        jest.setSystemTime(mockDate);

        // act
        const { startDate, endDate } = service.getTimeRange("M");

        // assert
        expect(startDate).toEqual(new Date(Date.UTC(2022, 8, 1))); // 01/09/2022 at 00:00:00:000
        expect(endDate).toEqual(new Date(Date.UTC(2022, 9, 1))); // 01/10/2022 at 00:00:00:000
      });

      it("should return correct result for last month of year", () => {
        // prepare
        mockDate = new Date(Date.UTC(2022, 11, 25, 10, 10, 10, 10)); // 25/12/2022 at 10:10:10:010
        jest.setSystemTime(mockDate);

        // act
        const { startDate, endDate } = service.getTimeRange("M");

        // assert
        expect(startDate).toEqual(new Date(Date.UTC(2022, 11, 1))); // 01/12/2022 at 00:00:00:000
        expect(endDate).toEqual(new Date(Date.UTC(2023, 0, 1))); // 01/01/2023 at 00:00:00:000
      });
    });
  });

  describe("createDetailsTableHTML()", () => {
    it("should return correct result", () => {
      // prepare
      const inputObject = {
        valueString: "test-string",
        valueNumber: 1,
        valueObject: {
          valueString: "test-string",
          valueNumber: 1,
        }
      }
      const expectedResult = `<table><tr style="border: 1px solid #dddddd"><td style="border: 1px solid #dddddd">valueString</td><td style="border: 1px solid #dddddd">${
        JSON.stringify(inputObject.valueString, null, 1)
      }</td></tr><tr style="border: 1px solid #dddddd"><td style="border: 1px solid #dddddd">valueNumber</td><td style="border: 1px solid #dddddd">${
        JSON.stringify(inputObject.valueNumber, null, 1)
      }</td></tr><tr style="border: 1px solid #dddddd"><td style="border: 1px solid #dddddd">valueObject</td><td style="border: 1px solid #dddddd">${
        JSON.stringify(inputObject.valueObject, null, 1)
      }</td></tr></table><br /><br />`;

      // act
      const result = service.createDetailsTableHTML([inputObject]);

      // assert
      expect(result).toEqual(expectedResult);
    });
  });
});