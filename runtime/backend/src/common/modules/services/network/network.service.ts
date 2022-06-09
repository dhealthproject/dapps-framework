import {
  BlockRepository,
  RepositoryFactoryHttp,
  TransactionRepository,
  UInt64,
} from '@dhealth/sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NetworkService {
  private repositoryFactoryHttp: RepositoryFactoryHttp;
  public readonly transactionRepository: TransactionRepository;
  public readonly blockRepository: BlockRepository;

  constructor(private readonly configService: ConfigService) {
    const defaultNode = this.configService.get<string>('defaultNode');
    this.repositoryFactoryHttp = new RepositoryFactoryHttp(defaultNode);
    this.transactionRepository =
      this.repositoryFactoryHttp.createTransactionRepository();
    this.blockRepository = this.repositoryFactoryHttp.createBlockRepository();
  }

  public async getBlockTimestamp(height: number): Promise<number> {
    const block = await this.blockRepository
      .getBlockByHeight(UInt64.fromUint(height))
      .toPromise();
    if (!block) throw new Error('Cannot query block from height');
    const timestamp = this.getNetworkTimestampFromUInt64(block.timestamp);
    return timestamp * 1e3;
  }

  private getNetworkTimestampFromUInt64(timestamp: UInt64): number {
    const timestampNumber = timestamp.compact();
    const epochAdjustment = this.configService.get<number>(
      'network.epochAdjustment',
    );
    return Math.round(timestampNumber / 1000) + epochAdjustment;
  }
}
