import {
  index,
  integer,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';

import { appRecords } from './app-records.schema';
import { appSteps } from '../application-builder/app-steps.schema';

export const appRuns = pgTable(
  'app_runs',
  {
    ...baseColumns,

    recordId: integer('record_id')
      .notNull()
      .references(() => appRecords.id, {
        onDelete: 'cascade',
      }),

    currentStepId: integer('current_step_id')
      .references(() => appSteps.id),

    status: varchar('status', {
      length: 30,
    })
      .notNull()
      .default('IN_PROGRESS'),

    startedAt: timestamp('started_at', {
      withTimezone: true,
    }).defaultNow(),

    completedAt: timestamp('completed_at', {
      withTimezone: true,
    }),

    lastActionAt: timestamp('last_action_at', {
      withTimezone: true,
    }),
  },
  (table) => ({
    recordIdx: index('idx_app_runs_record').on(
      table.recordId,
    ),

    stepIdx: index('idx_app_runs_current_step').on(
      table.currentStepId,
    ),

    statusIdx: index('idx_app_runs_status').on(
      table.status,
    ),
  }),
);