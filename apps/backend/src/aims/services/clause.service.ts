import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Clause } from '../entities/clause.entity';
import { Agent } from '../entities/agent.entity';
import { CreateClauseDto } from '../dto/create-clause.dto';
import { UpdateClauseDto } from '../dto/update-clause.dto';

@Injectable()
export class ClauseService {
  constructor(
    @InjectRepository(Clause)
    private clauseRepository: Repository<Clause>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {}

  async findAll(): Promise<Clause[]> {
    return this.clauseRepository.find({
      order: {
        sortOrder: 'ASC',
      },
      relations: ['agents'],
    });
  }

  async findOne(id: string): Promise<Clause> {
    const clause = await this.clauseRepository.findOne({
      where: { id },
      relations: ['agents'],
    });
    if (!clause) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }
    return clause;
  }

  async create(createClauseDto: CreateClauseDto): Promise<Clause> {
    const { agentIds, ...clauseData } = createClauseDto;

    // Create the clause without agents first
    const newClause = this.clauseRepository.create(clauseData);

    // If agent IDs are provided, fetch and assign the agents
    if (agentIds && agentIds.length > 0) {
      const agents = await this.agentRepository.find({
        where: { id: In(agentIds) },
      });

      newClause.agents = agents;
    }

    return this.clauseRepository.save(newClause);
  }

  async update(id: string, updateClauseDto: UpdateClauseDto): Promise<Clause> {
    const { agentIds, ...clauseData } = updateClauseDto;

    // Get the existing clause
    const clause = await this.findOne(id);
    if (!clause) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }

    // Update the basic clause properties
    Object.assign(clause, clauseData);

    // If agent IDs are provided, update the agents relationship
    if (agentIds !== undefined) {
      if (agentIds.length > 0) {
        const agents = await this.agentRepository.find({
          where: { id: In(agentIds) },
        });
        clause.agents = agents;
      } else {
        // If an empty array is provided, clear the agents
        clause.agents = [];
      }
    }

    // Save the updated clause with its relationships
    return this.clauseRepository.save(clause);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clauseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }
  }
}
