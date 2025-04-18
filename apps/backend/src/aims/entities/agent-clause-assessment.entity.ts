import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Agent } from './agent.entity';
import { Clause } from './clause.entity';

@Entity('agent_clause_assessments')
export class AgentClauseAssessment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'agent_id' })
  agentId: string;

  @Column({ name: 'clause_id' })
  clauseId: string;

  @Column({ name: 'evidence_link', type: 'text', nullable: true })
  evidenceLink: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Agent, (agent) => agent.assessments)
  @JoinColumn({ name: 'agent_id' })
  agent: Agent;

  @ManyToOne(() => Clause, (clause) => clause.assessments)
  @JoinColumn({ name: 'clause_id' })
  clause: Clause;
}
