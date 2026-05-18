import {
  pgTable,
  integer,
  varchar,
  json,
  timestamp,
} from 'drizzle-orm/pg-core';

export const auditLogs = pgTable('audit_logs', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  user_id: integer('user_id'),

  action: varchar('action', { length: 255 }).notNull(),

  module: varchar('module', { length: 100 }).notNull(),

  payload: json('payload'),

  created_at: timestamp('created_at').defaultNow(),
});