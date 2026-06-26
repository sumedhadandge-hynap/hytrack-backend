import {
  pgTable,
  integer,
  uuid,
  bigint,
  varchar,
  timestamp,
} from 'drizzle-orm/pg-core';

import { projectApps } from './project-apps.schema';
import { projects } from '../projects/projects.schema';

export const projectAppRecords = pgTable('project_app_records', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  uid: uuid('uid')
    .defaultRandom()
    .notNull()
    .unique(),

  project_app_id: bigint('project_app_id', {
    mode: 'number',
  })
    .notNull()
    .references(() => projectApps.id, {
      onDelete: 'cascade',
    }),

  project_id: bigint('project_id', {
    mode: 'number',
  })
    .notNull()
    .references(() => projects.id, {
      onDelete: 'cascade',
    }),

  status: varchar('status', {
    length: 50,
  })
    .notNull()
    .default('draft'),

  started_by: bigint('started_by', {
    mode: 'number',
  }),

  updated_by: bigint('updated_by', {
    mode: 'number',
  }),

  created_at: timestamp('created_at')
    .defaultNow(),

  updated_at: timestamp('updated_at')
    .defaultNow(),
});
