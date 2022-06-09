import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  State,
  StateDocument,
  StateDto,
  StateQueryDto,
} from 'src/common/models';

@Injectable()
export class StatesService {
  constructor(
    @InjectModel(State.name) private readonly model: Model<StateDocument>,
  ) {}

  async findOne(query: StateQueryDto): Promise<State> {
    return this.model.findOne(query).exec();
  }

  async updateOne(stateDto: StateDto) {
    return this.model
      .findOneAndUpdate({ name: stateDto.name }, stateDto, {
        upsert: true,
      })
      .exec();
  }
}
