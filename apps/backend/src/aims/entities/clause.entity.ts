import { Column, Entity, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import { Agent } from './agent.entity';

export enum ClauseStatus {
  GAP = 'gap',
  COMPLIANT = 'compliant',
  NON_COMPLIANT = 'non_compliant',
  PENDING = 'pending',
}

@Entity()
export class Clause {
  @PrimaryColumn()
  id: string; // ClauseId: 5.3, 6.1, etc. is primary key here because they're unique

  @Column({ type: 'int', default: 999 })
  sortOrder: number;

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

  @Column({ nullable: true })
  evidenceLink: string;

  @ManyToMany(() => Agent, (agent) => agent.clauses)
  @JoinTable()
  agents: Agent[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
