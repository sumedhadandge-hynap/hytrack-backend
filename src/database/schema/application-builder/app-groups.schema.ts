import {
  pgTable,
  varchar,
  integer,
  uniqueIndex,
  index,
  boolean,
} from 'drizzle-orm/pg-core';

import { companies } from '../company/companies.schema';
import { baseColumns } from '../common/common.schema';


export const appGroups = pgTable(
  'app_groups',
  {
    ...baseColumns,

    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id, {
        onDelete: 'cascade',
        onUpdate: 'cascade',
      }),

    name: varchar('name', {
      length: 100,
    }).notNull(),

    code: varchar('code', {
      length: 50,
    }).notNull(),

    description: varchar('description', {
      length: 500,
    }),

    icon: varchar('icon', {
      length: 255,
    }),

    color: varchar('color', {
      length: 20,
    }),

    displayOrder: integer('display_order').default(0),

    isSystem: boolean('is_system')
      .notNull()
      .default(false),
  },
  (table) => ({
    companyIdx: index('idx_app_groups_company').on(table.companyId),

    companyNameUnique: uniqueIndex(
      'uq_app_groups_company_name',
    ).on(table.companyId, table.name),

    companyCodeUnique: uniqueIndex(
      'uq_app_groups_company_code',
    ).on(table.companyId, table.code),
  }),
);