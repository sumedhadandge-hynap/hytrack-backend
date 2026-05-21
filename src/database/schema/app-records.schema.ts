import {
  pgTable,
  integer,
  uuid,
  varchar,
  timestamp,
  bigint,
} from 'drizzle-orm/pg-core';

import { apps } from './apps.schema';

export const appRecords = pgTable('app_records', {

  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  uid: uuid('uid')
    .defaultRandom()
    .notNull()
    .unique(),

  app_id: bigint('app_id', {
    mode: 'number',
  })
    .references(() => apps.id),

  company_id: bigint('company_id', {
    mode: 'number',
  }),

  project_id: bigint('project_id', {
    mode: 'number',
  }),

  record_number: varchar('record_number', {
    length: 100,
  }),

  status: varchar('status', {
    length: 50,
  }).default('draft'),

  created_by: bigint('created_by', {
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