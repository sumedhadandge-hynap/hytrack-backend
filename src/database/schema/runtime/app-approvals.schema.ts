import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';

import { appStepRuns } from './app-step-runs.schema';
import { users } from '../auth/users.schema';


export const appApprovals = pgTable(
  'app_approvals',
  {
    ...baseColumns,

    stepRunId: integer('step_run_id')
      .notNull()
      .references(() => appStepRuns.id, {
        onDelete: 'cascade',
      }),

    approverId: integer('approver_id')
      .notNull()
      .references(() => users.id),

    status: varchar('status', {
      length: 30,
    })
      .notNull()
      .default('PENDING'),

    action: varchar('action', {
      length: 30,
    }),

    comments: text('comments'),

    assignedAt: timestamp('assigned_at', {
      withTimezone: true,
    }).defaultNow(),

    actionAt: timestamp('action_at', {
      withTimezone: true,
    }),

    dueAt: timestamp('due_at', {
      withTimezone: true,
    }),

    delegatedTo: integer('delegated_to')
      .references(() => users.id),

    escalatedTo: integer('escalated_to')
      .references(() => users.id),
  },
  (table) => ({
    stepRunIdx: index('idx_app_approvals_step_run').on(
      table.stepRunId,
    ),

    approverIdx: index('idx_app_approvals_approver').on(
      table.approverId,
    ),

    statusIdx: index('idx_app_approvals_status').on(
      table.status,
    ),
  }),
);