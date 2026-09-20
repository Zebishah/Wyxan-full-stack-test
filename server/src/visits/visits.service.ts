import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PeopleService } from '../people/people.service';
import { normalizeAddress } from '../common/validation/address';
import { CreateVisitDto } from './dto/create-visit.dto';
import { Visit, VisitDocument } from './visit.schema';

@Injectable()
export class VisitsService {
  constructor(@InjectModel(Visit.name) private readonly visits: Model<VisitDocument>, private readonly people: PeopleService) {}

  async listForPerson(personId: string) {
    await this.people.findOne(personId);
    return this.visits.find({ personId: new Types.ObjectId(personId) }).sort({ visitedAt: -1 }).limit(200).lean();
  }

  async create(dto: CreateVisitDto) {
    await this.people.findOne(dto.personId);
    return this.visits.create({ ...dto, address: normalizeAddress(dto.address), personId: new Types.ObjectId(dto.personId), visitedAt: new Date() });
  }
}
