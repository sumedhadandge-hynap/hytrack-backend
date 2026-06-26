import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';

import { appRuns } from './app-runs.schema';
import { appSteps } from '../application-builder/app-steps.schema';

export const appStepRuns = pgTable(
  'app_step_runs',
  {
    ...baseColumns,

    runId: integer('run_id')
      .notNull()
      .references(() => appRuns.id, {
        onDelete: 'cascade',
      }),

    stepId: integer('step_id')
      .notNull()
      .references(() => appSteps.id),

    status: varchar('status', {
      length: 30,
    })
      .notNull()
      .default('PENDING'),

    assignedTo: integer('assigned_to'),

    startedAt: timestamp('started_at', {
      withTimezone: true,
    }),

    completedAt: timestamp('completed_at', {
      withTimezone: true,
    }),

    remarks: text('remarks'),

    isSkipped: boolean('is_skipped')
      .notNull()
      .default(false),
  },
  (table) => ({
    runIdx: index('idx_app_step_runs_run').on(table.runId),

    stepIdx: index('idx_app_step_runs_step').on(table.stepId),

    statusIdx: index('idx_app_step_runs_status').on(table.status),
  }),
);