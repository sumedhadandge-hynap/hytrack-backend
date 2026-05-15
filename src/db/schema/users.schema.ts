import {
  pgTable,
  integer,
  bigint,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';
import { companies } from './companies.schema.js';

export const users = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

  uid: uuid('uid')
    .defaultRandom()
    .notNull()
    .unique(),

  company_id: bigint('company_id', { mode: 'number' })
    .notNull()
    .references(() => companies.id, {
      onDelete: 'cascade',
    }),

  first_name: varchar('first_name', { length: 100 }).notNull(),

  last_name: varchar('last_name', { length: 100 }),

  email: varchar('email', { length: 255 })
    .notNull()
    .unique(),

  mobile: varchar('mobile', { length: 20 }).unique(),

  password_hash: text('password_hash').notNull(),

  profile_image_url: text('profile_image_url'),

  status: varchar('status', { length: 50 })
    .default('active'),

  is_active: boolean('is_active')
    .default(true),

  is_super_admin: boolean('is_super_admin')
    .default(false),

  last_login: timestamp('last_login'),

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