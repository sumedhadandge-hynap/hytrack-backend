import {
  integer,
  pgTable,
  varchar,
  text,
  boolean,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';


import { appGroups } from './app-groups.schema';
import { appTypes } from './app-types.schema';
import { companies } from '../company/companies.schema';

export const apps = pgTable(
  'apps',
  {
    ...baseColumns,

    companyId: integer('company_id')
      .notNull()
      .references(() => companies.id, {
        onDelete: 'cascade',
      }),

    groupId: integer('group_id')
      .references(() => appGroups.id, {
        onDelete: 'set null',
      }),

    typeId: integer('type_id')
      .notNull()
      .references(() => appTypes.id),

    name: varchar('name', {
      length: 150,
    }).notNull(),

    code: varchar('code', {
      length: 100,
    }).notNull(),

    description: text('description'),

    icon: varchar('icon', {
      length: 255,
    }),

    color: varchar('color', {
      length: 30,
    }),

    currentVersionId: integer('current_version_id'),

    isPublished: boolean('is_published')
      .notNull()
      .default(false),

    isSystem: boolean('is_system')
      .notNull()
      .default(false),
  },
  (table) => ({
    companyIdx: index('idx_apps_company').on(table.companyId),

    groupIdx: index('idx_apps_group').on(table.groupId),

    typeIdx: index('idx_apps_type').on(table.typeId),

    companyCodeUnique: uniqueIndex('uq_apps_company_code').on(
      table.companyId,
      table.code,
    ),
  }),
);