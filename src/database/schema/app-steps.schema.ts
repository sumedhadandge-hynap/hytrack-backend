import {
  pgTable,
  integer,
  uuid,
  varchar,
  text,
  timestamp,
  bigint,
  boolean,
} from 'drizzle-orm/pg-core';

import { apps } from './apps.schema';
import { appVersions }
  from './app-versions.schema';

export const appSteps = pgTable('app_steps', {

  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  uid: uuid('uid')
    .defaultRandom()
    .notNull()
    .unique(),

  // app_id: bigint('app_id', {
  //   mode: 'number',
  // })
  //   .notNull()
  //   .references(() => apps.id, {
  //     onDelete: 'cascade',
  //   }),

  name: varchar('name', {
    length: 255,
  }).notNull(),

  description: text('description'),

  step_type: varchar('step_type', {
    length: 50,
  }).notNull(),

  order_index: integer('order_index')
    .default(1),

  is_required: boolean('is_required')
    .default(true),


  version_id: bigint('version_id', {
    mode: 'number',
  })
    .notNull()
    .references(() => appVersions.id, {
      onDelete: 'cascade',
    }),

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