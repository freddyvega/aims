import { PartialType } from '@nestjs/mapped-types';
import { CreateAgentClauseAssessmentDto } from './create-agent-clause-assessment.dto';

export class UpdateAgentClauseAssessmentDto extends PartialType(
  CreateAgentClauseAssessmentDto,
) {}
