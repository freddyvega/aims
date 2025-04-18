import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../entities/agent.entity';
import { CreateAgentDto } from '../dto/create-agent.dto';
import { UpdateAgentDto } from '../dto/update-agent.dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {}

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    const agent = this.agentRepository.create(createAgentDto);
    return this.agentRepository.save(agent);
  }

  async findAll(): Promise<Agent[]> {
    return this.agentRepository.find({
      relations: ['clauses', 'assessments', 'assessments.clause'],
    });
  }

  async findOne(id: string): Promise<Agent> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['clauses', 'assessments', 'assessments.clause'],
    });
    if (!agent) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
    return agent;
  }

  async update(id: string, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.findOne(id);
    Object.assign(agent, updateAgentDto);
    return this.agentRepository.save(agent);
  }

  async remove(id: string): Promise<void> {
    const result = await this.agentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Agent with ID ${id} not found`);
    }
  }
}
