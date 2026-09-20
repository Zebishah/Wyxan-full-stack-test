import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateVisitDto } from './dto/create-visit.dto';
import { VisitsService } from './visits.service';

@Controller('visits')
export class VisitsController {
  constructor(private readonly visits: VisitsService) {}
  @Get('person/:personId') list(@Param('personId') personId: string) { return this.visits.listForPerson(personId); }
  @Post() create(@Body() dto: CreateVisitDto) { return this.visits.create(dto); }
}
