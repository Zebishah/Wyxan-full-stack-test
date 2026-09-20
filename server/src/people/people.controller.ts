import { Controller, Get, Param } from '@nestjs/common';
import { PeopleService } from './people.service';

@Controller('people')
export class PeopleController {
  constructor(private readonly people: PeopleService) {}
  @Get() list() { return this.people.list(); }
  @Get(':id') find(@Param('id') id: string) { return this.people.findOne(id); }
}
