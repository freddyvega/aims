import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AgentClauseAssessmentService } from '../services/agent-clause-assessment.service';
import { AgentClauseAssessment } from '../entities/agent-clause-assessment.entity';
import { CreateAgentClauseAssessmentDto } from '../dto/create-agent-clause-assessment.dto';
import { UpdateAgentClauseAssessmentDto } from '../dto/update-agent-clause-assessment.dto';

@Controller('agent-clause-assessments')
export class AgentClauseAssessmentController {
  constructor(
    private readonly assessmentService: AgentClauseAssessmentService,
  ) {}

  @Get()
  findAll(
    @Query('agentId') agentId?: string,
    @Query('clauseId') clauseId?: string,
  ): Promise<AgentClauseAssessment[]> {
    return this.assessmentService.findAll(agentId, clauseId);
  }

  @Post()
  create(
    @Body() createDto: CreateAgentClauseAssessmentDto,
  ): Promise<AgentClauseAssessment> {
    return this.assessmentService.create(createDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.assessmentService.remove(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateAgentClauseAssessmentDto,
  ): Promise<AgentClauseAssessment> {
    return this.assessmentService.update(id, updateDto);
  }
}
