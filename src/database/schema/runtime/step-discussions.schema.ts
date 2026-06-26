import {
  index,
  integer,
  pgTable,
  text,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';

import { appStepRuns } from './app-step-runs.schema';
import { users } from '../auth/users.schema';


export const stepDiscussions = pgTable(
  'step_discussions',
  {
    ...baseColumns,

    stepRunId: integer('step_run_id')
      .notNull()
      .references(() => appStepRuns.id, {
        onDelete: 'cascade',
      }),

    parentId: integer('parent_id'),

    userId: integer('user_id')
      .notNull()
      .references(() => users.id),

    message: text('message').notNull(),
  },
  (table) => ({
    stepIdx: index('idx_step_discussions_step').on(
      table.stepRunId,
    ),

    userIdx: index('idx_step_discussions_user').on(
      table.userId,
    ),

    parentIdx: index('idx_step_discussions_parent').on(
      table.parentId,
    ),
  }),
);