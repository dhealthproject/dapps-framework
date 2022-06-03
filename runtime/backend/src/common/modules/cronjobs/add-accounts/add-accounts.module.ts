import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AccountsModule } from '../../routes/accounts/accounts.module';
import { AddAccountsService } from './add-accounts.service';

@Module({
  imports: [ScheduleModule.forRoot(), AccountsModule],
  providers: [AddAccountsService],
  exports: [AddAccountsService],
})
export class AddAccountsModule {}
