import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AgentController } from "./controllers/agent.controller";
import { AgentService } from "./services/agent.service";
import { Agent } from "./entities/agent.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  controllers: [AgentController],
  providers: [AgentService],
  exports: [AgentService],
})
export class AimsModule {}
