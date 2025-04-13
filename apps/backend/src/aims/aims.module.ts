import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentController } from './controllers/agent.controller';
import { AgentService } from './services/agent.service';
import { Agent } from './entities/agent.entity';
import { ClauseController } from './controllers/clause.controller';
import { ClauseService } from './services/clause.service';
import { Clause } from './entities/clause.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agent, Clause])],
  controllers: [AgentController, ClauseController],
  providers: [AgentService, ClauseService],
  exports: [AgentService, ClauseService],
})
export class AimsModule {}
