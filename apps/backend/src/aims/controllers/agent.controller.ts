import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AgentService } from '../services/agent.service';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { UpdateAgentDto } from '../dto/update-agent.dto';
import { Agent } from '../entities/agent.entity';

@Controller('agents')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post()
  create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentService.create(createAgentDto);
  }

  @Get()
  async findAll() {
    const agents = await this.agentService.findAll();
    return agents.map((agent) => this.transformAgentResponse(agent));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const agent = await this.agentService.findOne(id);
    return this.transformAgentResponse(agent);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
    return this.agentService.update(id, updateAgentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agentService.remove(id);
  }

  // Helper method to transform agent response for frontend
  private transformAgentResponse(agent: Agent) {
    const { assessments, ...rest } = agent;
    return {
      ...rest,
      scopedAssessments: assessments,
    };
  }
}
