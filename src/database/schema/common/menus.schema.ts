// src/database/schema/menus.schema.ts

import {
  pgTable,
  varchar,
  integer,
  boolean,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { baseColumns } from './common.schema';

export const menus = pgTable('menus', {
  ...baseColumns,

  name: varchar('name', { length: 100 }).notNull(),

  route: varchar('route', { length: 255 }).notNull(),

  icon: varchar('icon', { length: 100 }),

  parent_id: integer('parent_id'),

  order_index: integer('order_index').default(0),

  is_visible: boolean('is_visible').default(true),

  permission_code: varchar('permission_code', {
    length: 100,
  }),
}, (t) => [
  uniqueIndex('menus_uid_unique').on(t.uid),
]);