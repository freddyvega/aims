import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Clause } from './clause.entity';
import { AgentClauseAssessment } from './agent-clause-assessment.entity';

@Entity('agents')
export class Agent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ length: 255 })
  type: string;

  @Column({ type: 'jsonb', nullable: true })
  capabilities: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  configuration: Record<string, any>;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(() => Clause, (clause) => clause.agents)
  clauses: Clause[];

  @OneToMany(() => AgentClauseAssessment, (assessment) => assessment.agent, {
    cascade: true,
  })
  assessments: AgentClauseAssessment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
