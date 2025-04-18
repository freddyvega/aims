import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AgentClauseAssessment } from '../entities/agent-clause-assessment.entity';
import { CreateAgentClauseAssessmentDto } from '../dto/create-agent-clause-assessment.dto';
import { UpdateAgentClauseAssessmentDto } from '../dto/update-agent-clause-assessment.dto';
import { Agent } from '../entities/agent.entity';
import { Clause } from '../entities/clause.entity';

@Injectable()
export class AgentClauseAssessmentService {
  constructor(
    @InjectRepository(AgentClauseAssessment)
    private readonly assessmentRepository: Repository<AgentClauseAssessment>,

    @InjectRepository(Agent)
    private readonly agentRepo: Repository<Agent>,

    @InjectRepository(Clause)
    private readonly clauseRepo: Repository<Clause>,
  ) {}

  async findAll(
    agentId?: string,
    clauseId?: string,
  ): Promise<AgentClauseAssessment[]> {
    const whereCondition: any = {};

    if (agentId) {
      whereCondition.agentId = agentId;
    }

    if (clauseId) {
      whereCondition.clauseId = clauseId;
    }

    return this.assessmentRepository.find({
      where:
        Object.keys(whereCondition).length > 0 ? whereCondition : undefined,
      relations: ['agent', 'clause'],
    });
  }

  async create(
    dto: CreateAgentClauseAssessmentDto,
  ): Promise<AgentClauseAssessment> {
    const agent = await this.agentRepo.findOneByOrFail({ id: dto.agentId });
    const clause = await this.clauseRepo.findOneByOrFail({
      id: dto.clauseId,
    });

    const assessment = this.assessmentRepository.create({
      agent,
      clause,
      evidenceLink: dto.evidenceLink,
    });

    return this.assessmentRepository.save(assessment);
  }

  async remove(id: string): Promise<void> {
    await this.assessmentRepository.delete(id);
  }

  async update(
    id: string,
    updateDto: UpdateAgentClauseAssessmentDto,
  ): Promise<AgentClauseAssessment> {
    const assessment = await this.assessmentRepository.findOne({
      where: { id },
      relations: ['agent', 'clause'],
    });

    if (!assessment) {
      throw new NotFoundException(`Assessment with ID ${id} not found`);
    }

    Object.assign(assessment, updateDto);
    return this.assessmentRepository.save(assessment);
  }
}
