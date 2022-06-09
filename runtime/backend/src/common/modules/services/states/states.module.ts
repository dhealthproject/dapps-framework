import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { State, StateSchema } from 'src/common/models';
import { StatesService } from './states.service';

@Module({
  providers: [StatesService],
  imports: [
    MongooseModule.forFeature([{ name: State.name, schema: StateSchema }]),
  ],
  exports: [StatesService],
})
export class StatesModule {}
