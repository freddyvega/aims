import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentController } from './controllers/agent.controller';
import { AgentService } from './services/agent.service';
import { Agent } from './entities/agent.entity';
import { ClauseController } from './controllers/clause.controller';
import { ClauseService } from './services/clause.service';
import { Clause } from './entities/clause.entity';
import { AgentClauseAssessment } from './entities/agent-clause-assessment.entity';
import { AgentClauseAssessmentController } from './controllers/agent-clause-assessment.controller';
import { AgentClauseAssessmentService } from './services/agent-clause-assessment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, Clause, AgentClauseAssessment])],
  controllers: [AgentController, ClauseController, AgentClauseAssessmentController],
  providers: [AgentService, ClauseService, AgentClauseAssessmentService],
  exports: [AgentService, ClauseService, AgentClauseAssessmentService],
})
export class AimsModule {}
