import { Module } from '@nestjs/common';
import { NetworkService } from './network.service';

@Module({
  providers: [NetworkService],
  exports: [NetworkService],
})
export class NetworkModule {}
