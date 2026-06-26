import {
  boolean,
  index,
  integer,
  pgTable,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';

import { appSteps } from '../application-builder/app-steps.schema';

import { roles } from '../auth/roles.schema';
import { users } from '../auth/users.schema';

export const stepApprovers = pgTable(
  'step_approvers',
  {
    ...baseColumns,

    stepId: integer('step_id')
      .notNull()
      .references(() => appSteps.id, {
        onDelete: 'cascade',
      }),

    approvalLevel: integer('approval_level')
      .notNull()
      .default(1),

    approvalType: varchar('approval_type', {
      length: 30,
    })
      .notNull()
      .default('USER'),

    userId: integer('user_id')
      .references(() => users.id),

    roleId: integer('role_id')
      .references(() => roles.id),

    sequence: integer('sequence')
      .notNull()
      .default(1),

    isRequired: boolean('is_required')
      .notNull()
      .default(true),

    isParallel: boolean('is_parallel')
      .notNull()
      .default(false),
  },
  (table) => ({
    stepIdx: index('idx_step_approvers_step').on(
      table.stepId,
    ),

    userIdx: index('idx_step_approvers_user').on(
      table.userId,
    ),

    roleIdx: index('idx_step_approvers_role').on(
      table.roleId,
    ),

    uniqueApprover: uniqueIndex(
      'uq_step_approvers_step_sequence',
    ).on(
      table.stepId,
      table.sequence,
    ),
  }),
);