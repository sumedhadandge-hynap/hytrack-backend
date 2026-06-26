import {
  pgTable,
  varchar,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';

export const permissions = pgTable(
  'permissions',
  {
    ...baseColumns,

    name: varchar('name', {
      length: 100,
    }).notNull(),

    code: varchar('code', {
      length: 100,
    }).notNull(),

    module: varchar('module', {
      length: 100,
    }).notNull(),

    description: text('description'),
  },
  (table) => ({
    permissionCodeUnique: uniqueIndex(
      'uq_permissions_code',
    ).on(table.code),

    permissionUidUnique: uniqueIndex(
      'uq_permissions_uid',
    ).on(table.uid),
  }),
);