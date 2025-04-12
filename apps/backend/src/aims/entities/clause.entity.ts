import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Agent } from './agent.entity';

export enum ClauseStatus {
  GAP = 'gap',
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING = 'pending',
}

@Entity()
export class Clause {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: ClauseStatus,
    default: ClauseStatus.PENDING,
  })
  status: ClauseStatus;

  @ManyToMany(() => Agent, (agent) => agent.clauses)
  @JoinTable()
  agents: Agent[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
