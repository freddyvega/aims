import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClauseService } from '../services/clause.service';
import { CreateClauseDto } from '../dto/create-clause.dto';
import { UpdateClauseDto } from '../dto/update-clause.dto';

@Controller('clauses')
export class ClauseController {
  constructor(private readonly clauseService: ClauseService) {}

  @Post()
  create(@Body() createClauseDto: CreateClauseDto) {
    return this.clauseService.create(createClauseDto);
  }

  @Get()
  findAll() {
    return this.clauseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clauseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClauseDto: UpdateClauseDto) {
    return this.clauseService.update(id, updateClauseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clauseService.remove(id);
  }
}
