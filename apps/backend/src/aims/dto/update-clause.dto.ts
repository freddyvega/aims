import { PartialType } from '@nestjs/mapped-types';
import { CreateClauseDto } from './create-clause.dto';

export class UpdateClauseDto extends PartialType(CreateClauseDto) {}
