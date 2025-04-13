import { DataSource } from 'typeorm';
import { Clause, ClauseStatus } from '../src/aims/entities/clause.entity';
import { Agent } from '../src/aims/entities/agent.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'aims',
  entities: [Clause, Agent],
  synchronize: false,
});

const ISO_CLAUSES = [
  {
    id: '4.1',
    sortOrder: 1,
    title: 'Understanding the organization and its context',
    description:
      'Requires organizations to assess internal and external factors relevant to the AI system.',
  },
  {
    id: '4.2',
    sortOrder: 2,
    title: 'Understanding the needs and expectations of interested parties',
    description:
      'Defines how organizations should identify and consider the needs of stakeholders.',
  },
  {
    id: '4.3',
    sortOrder: 3,
    title: 'Determining the scope of the AI management system',
    description:
      'Guides organizations in setting boundaries and applicability of the AI management system.',
  },
  {
    id: '4.4',
    sortOrder: 4,
    title: 'AI management system',
    description:
      'Details the need for organizations to establish and maintain a management system tailored to AI.',
  },
  {
    id: '5.1',
    sortOrder: 5,
    title: 'Leadership and commitment',
    description:
      'Outlines how leadership must support and integrate AI management into organizational strategy.',
  },
  {
    id: '5.2',
    sortOrder: 6,
    title: 'AI policy',
    description:
      'Requires creation of a formal AI policy that aligns with organizational goals.',
  },
  {
    id: '5.3',
    sortOrder: 7,
    title: 'Roles, responsibilities and authorities',
    description:
      'Mandates clear assignment and communication of responsibilities for AI system oversight.',
  },
  {
    id: '6.1.2',
    sortOrder: 8,
    title: 'AI risk assessment',
    description:
      'Establishes requirements for performing systematic assessments of AI-related risks.',
  },
  {
    id: '6.1.3',
    sortOrder: 9,
    title: 'AI risk treatment',
    description:
      'Specifies processes for addressing identified AI risks with appropriate controls.',
  },
  {
    id: '6.1.4',
    sortOrder: 10,
    title: 'AI system impact assessment',
    description:
      'Details processes for assessing social and individual impacts of AI systems.',
  },
  {
    id: '6.2',
    sortOrder: 11,
    title: 'AI objectives and planning to achieve them',
    description:
      'Explains how to define and plan AI objectives across the organization.',
  },
  {
    id: '6.3',
    sortOrder: 12,
    title: 'Planning of changes',
    description:
      'Requires controlled planning for changes to the AI management system.',
  },
  {
    id: '7.1',
    sortOrder: 13,
    title: 'Resources',
    description:
      'Identifies and provides resources needed for effective AI management.',
  },
  {
    id: '7.2',
    sortOrder: 14,
    title: 'Competence',
    description:
      'Ensures individuals working on AI systems are competent through training and experience.',
  },
  {
    id: '7.3',
    sortOrder: 15,
    title: 'Awareness',
    description:
      'Mandates that all relevant personnel are aware of the AI policy and their roles.',
  },
  {
    id: '7.4',
    sortOrder: 16,
    title: 'Communication',
    description:
      'Outlines requirements for internal and external communication about the AI system.',
  },
  {
    id: '7.5.3',
    sortOrder: 17,
    title: 'Control of documented information',
    description: 'Specifies how documentation should be protected and managed.',
  },
  {
    id: '8.1',
    sortOrder: 18,
    title: 'Operational planning and control',
    description:
      'Establishes how to plan and control AI-related operations and processes.',
  },
  {
    id: '8.2',
    sortOrder: 19,
    title: 'AI risk assessment',
    description:
      'Requires periodic reassessment of AI risks as operations evolve.',
  },
  {
    id: '8.3',
    sortOrder: 20,
    title: 'AI risk treatment',
    description: 'Mandates implementation and review of risk treatment plans.',
  },
  {
    id: '8.4',
    sortOrder: 21,
    title: 'AI system impact assessment',
    description:
      'Requires ongoing impact assessments during operational phases.',
  },
  {
    id: '9.1',
    sortOrder: 22,
    title: 'Monitoring, measurement, analysis and evaluation',
    description:
      'Outlines how to collect and analyze data on AI system performance.',
  },
  {
    id: '9.2.1',
    sortOrder: 23,
    title: 'General',
    description:
      'Establishes auditing scope, frequency, and implementation guidelines.',
  },
  {
    id: '9.2.2',
    sortOrder: 24,
    title: 'Internal audit programme',
    description: 'Details requirements for planning and conducting audits.',
  },
  {
    id: '9.3.1',
    sortOrder: 25,
    title: 'General',
    description:
      'States that leadership must assess adequacy and effectiveness.',
  },
  {
    id: '9.3.2',
    sortOrder: 26,
    title: 'Management review inputs',
    description: 'Specifies the input data required for effective review.',
  },
  {
    id: '9.3.3',
    sortOrder: 27,
    title: 'Management review results',
    description:
      'Outlines how results should be documented and used for improvement.',
  },
  {
    id: '10.1',
    sortOrder: 28,
    title: 'Continual improvement',
    description: 'Requires proactive enhancement of the AI management system.',
  },
  {
    id: '10.2',
    sortOrder: 29,
    title: 'Nonconformity and corrective action',
    description:
      'Defines processes to address system failures and prevent recurrence.',
  },
];

async function seed() {
  await AppDataSource.initialize();
  const repo = AppDataSource.getRepository(Clause);

  for (const clause of ISO_CLAUSES) {
    const existing = await repo.findOneBy({ id: clause.id });

    if (!existing) {
      const newClause = repo.create({
        ...clause,
        status: ClauseStatus.PENDING,
      });
      await repo.save(newClause);
      console.log(`✅ Seeded clause: ${clause.id}`);
    } else {
      // 🔁 Update sortOrder if missing or incorrect
      if (existing.sortOrder !== clause.sortOrder) {
        existing.sortOrder = clause.sortOrder;
        await repo.save(existing);
        console.log(`🔁 Updated sortOrder for clause: ${clause.id}`);
      } else {
        console.log(`⚠️  Clause ${clause.id} already exists. Skipping.`);
      }
    }
  }

  await AppDataSource.destroy();
  console.log('✅ ISO 42001 clause seeding complete.');
}

seed().catch((err) => {
  console.error('❌ Error seeding clauses:', err);
  process.exit(1);
});
