import {
  pgTable,
  integer,
  bigint,
  uuid,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { appSteps } from './app-steps.schema';
import { roles } from './roles.schema';
import { users } from './users.schema';

export const stepApprovers = pgTable('step_approvers', {

  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  uid: uuid('uid')
    .defaultRandom()
    .notNull()
    .unique(),

  step_id: bigint('step_id', {
    mode: 'number',
  })
    .references(() => appSteps.id, {
      onDelete: 'cascade',
    }),

  role_id: bigint('role_id', {
    mode: 'number',
  })
    .references(() => roles.id),

  user_id: bigint('user_id', {
    mode: 'number',
  })
    .references(() => users.id),

  approval_type: varchar('approval_type', {
    length: 50,
  })
    .default('any'),

  rejection_action: varchar('rejection_action', {
    length: 50,
  })
    .default('previous'),

  order_index: integer('order_index')
    .default(1),

  created_at: timestamp('created_at')
    .defaultNow(),


  updated_at: timestamp('updated_at')
    .defaultNow(),

  created_by: bigint('created_by', {
    mode: 'number',
  }),

  updated_by: bigint('updated_by', {
    mode: 'number',
  }),

});