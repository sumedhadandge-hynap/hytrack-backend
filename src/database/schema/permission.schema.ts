// src/database/schema/permission.schema.ts

import {
  pgTable,
  varchar,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { baseFields } from './common.schema';

export const permissions = pgTable('permissions', {
  ...baseFields,

  name: varchar('name', { length: 100 }).notNull(),

  code: varchar('code', { length: 100 })
    .notNull()
    .unique(),

  module: varchar('module', { length: 100 }).notNull(),

  description: text('description'),
}, (t) => [
  uniqueIndex('permissions_uid_unique').on(t.uid),
]);