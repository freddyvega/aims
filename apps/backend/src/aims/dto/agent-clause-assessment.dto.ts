import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class AgentClauseAssessmentDto {
  @IsUUID()
  id: string;

  @IsUUID()
  @IsNotEmpty()
  agentId: string;

  @IsString()
  @IsNotEmpty()
  clauseId: string;

  @IsString()
  @IsOptional()
  evidenceLink?: string;

  createdAt: Date;
  updatedAt: Date;
}
