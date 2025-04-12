import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
  IsUUID,
} from 'class-validator';
import { ClauseStatus } from '../entities/clause.entity';

export class CreateClauseDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsEnum(ClauseStatus)
  status: ClauseStatus;

  @IsString()
  @IsOptional()
  evidenceLink?: string | null;

  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  agentIds?: string[];
}
