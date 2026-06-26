import {
  pgTable,
  integer,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  bigint,
} from 'drizzle-orm/pg-core';

export const appGroups = pgTable('app_groups', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  uid: uuid('uid')
    .defaultRandom()
    .notNull()
    .unique(),

  name: varchar('name', {
    length: 255,
  }).notNull(),

  code: varchar('code', {
    length: 100,
  })
    .notNull()
    .unique(),

  description: text('description'),

  icon_url: text('icon_url'),

  sort_order: integer('sort_order')
    .default(0)
    .notNull(),

  is_active: boolean('is_active')
    .default(true)
    .notNull(),

  created_by: bigint('created_by', {
    mode: 'number',
  }),

  updated_by: bigint('updated_by', {
    mode: 'number',
  }),

  created_at: timestamp('created_at')
    .defaultNow()
    .notNull(),

  updated_at: timestamp('updated_at')
    .defaultNow()
    .notNull(),
});