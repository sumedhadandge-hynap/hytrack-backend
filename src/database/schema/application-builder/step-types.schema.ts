import {
  boolean,
  jsonb,
  pgTable,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';

export const stepTypes = pgTable(
  'step_types',
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

    supportsFields: boolean('supports_fields')
      .notNull()
      .default(true),

    supportsWorkflow: boolean('supports_workflow')
      .notNull()
      .default(false),

    supportsApproval: boolean('supports_approval')
      .notNull()
      .default(false),

    supportsDiscussion: boolean('supports_discussion')
      .notNull()
      .default(false),

    supportsAttachments: boolean('supports_attachments')
      .notNull()
      .default(false),

    supportsComments: boolean('supports_comments')
      .notNull()
      .default(false),

    settings: jsonb('settings').$type<Record<string, any>>(),

    isSystem: boolean('is_system')
      .notNull()
      .default(true),
  },
  (table) => ({
    nameUnique: uniqueIndex('uq_step_types_name').on(table.name),

    codeUnique: uniqueIndex('uq_step_types_code').on(table.code),
  }),
);