import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Person, PersonDocument } from './person.schema';

@Injectable()
export class PeopleService {
  constructor(@InjectModel(Person.name) private readonly people: Model<PersonDocument>) {}

  list() { return this.people.find().sort({ name: 1 }).lean(); }

  async findOne(id: string): Promise<PersonDocument> {
    const person = await this.people.findById(id).lean();
    if (!person) throw new NotFoundException('Person not found.');
    return person as PersonDocument;
  }
}
