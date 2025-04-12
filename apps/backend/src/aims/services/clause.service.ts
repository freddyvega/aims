import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Clause } from '../entities/clause.entity';
import { CreateClauseDto } from '../dto/create-clause.dto';
import { UpdateClauseDto } from '../dto/update-clause.dto';

@Injectable()
export class ClauseService {
  constructor(
    @InjectRepository(Clause)
    private clauseRepository: Repository<Clause>,
  ) {}

  async findAll(): Promise<Clause[]> {
    return this.clauseRepository.find();
  }

  async findOne(id: string): Promise<Clause> {
    const clause = await this.clauseRepository.findOne({ where: { id } });
    if (!clause) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }
    return clause;
  }

  async create(createClauseDto: CreateClauseDto): Promise<Clause> {
    const newClause = this.clauseRepository.create(createClauseDto);
    return this.clauseRepository.save(newClause);
  }

  async update(id: string, updateClauseDto: UpdateClauseDto): Promise<Clause> {
    const clause = await this.findOne(id);
    if (!clause) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }
    await this.clauseRepository.update(id, updateClauseDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.clauseRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Clause with ID ${id} not found`);
    }
  }
}
