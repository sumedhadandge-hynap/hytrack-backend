// src/database/schema/common.schema.ts

import {
  integer,
  uuid,
  timestamp,
} from 'drizzle-orm/pg-core';

export const baseFields = {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  uid: uuid('uid')
    .defaultRandom()
    .notNull(),

  created_by: integer('created_by'),

  updated_by: integer('updated_by'),

  created_at: timestamp('created_at')
    .defaultNow()
    .notNull(),

  updated_at: timestamp('updated_at')
    .defaultNow()
    .notNull(),
};