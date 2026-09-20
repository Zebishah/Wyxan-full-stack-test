import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PeopleModule } from '../people/people.module';
import { VisitsController } from './visits.controller';
import { VisitsService } from './visits.service';
import { Visit, VisitSchema } from './visit.schema';

@Module({ imports: [MongooseModule.forFeature([{ name: Visit.name, schema: VisitSchema }]), PeopleModule], controllers: [VisitsController], providers: [VisitsService] })
export class VisitsModule {}
