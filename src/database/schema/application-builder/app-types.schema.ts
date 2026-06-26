import {
  pgTable,
  varchar,
  uniqueIndex,
  boolean,
} from 'drizzle-orm/pg-core';
import { baseColumns } from '../common/common.schema';



export const appTypes = pgTable(
  'app_types',
  {
    ...baseColumns,

    name: varchar('name', {
      length: 100,
    }).notNull(),

    code: varchar('code', {
      length: 50,
    }).notNull(),

    description: varchar('description', {
      length: 500,
    }),

    isSystem: boolean('is_system')
      .notNull()
      .default(true),
  },
  (table) => ({
    nameUnique: uniqueIndex('uq_app_types_name').on(table.name),

    codeUnique: uniqueIndex('uq_app_types_code').on(table.code),
  }),
);