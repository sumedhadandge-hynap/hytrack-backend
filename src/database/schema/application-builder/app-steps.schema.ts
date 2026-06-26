import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';
import { appVersions } from './app-versions.schema';
import { stepTypes } from './step-types.schema';

export interface StepSettings {
  allowDraft?: boolean;
  allowReopen?: boolean;
  allowSkip?: boolean;
  allowComments?: boolean;
  allowAttachments?: boolean;
}

export const appSteps = pgTable(
  'app_steps',
  {
    ...baseColumns,

    versionId: integer('version_id')
      .notNull()
      .references(() => appVersions.id, {
        onDelete: 'cascade',
      }),

    stepTypeId: integer('step_type_id')
      .notNull()
      .references(() => stepTypes.id),

    name: varchar('name', {
      length: 150,
    }).notNull(),

    code: varchar('code', {
      length: 100,
    }).notNull(),

    description: text('description'),

    stepOrder: integer('step_order')
      .notNull()
      .default(1),

    isRequired: boolean('is_required')
      .notNull()
      .default(true),

    isActive: boolean('is_active')
      .notNull()
      .default(true),

    settings: jsonb('settings').$type<StepSettings>(),
  },
  (table) => ({
    versionIdx: index('idx_app_steps_version').on(table.versionId),

    typeIdx: index('idx_app_steps_type').on(table.stepTypeId),

    orderIdx: index('idx_app_steps_order').on(
      table.versionId,
      table.stepOrder,
    ),

    versionCodeUnique: uniqueIndex('uq_app_steps_version_code').on(
      table.versionId,
      table.code,
    ),
  }),
);