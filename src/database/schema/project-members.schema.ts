import {
  pgTable,
  integer,
  uuid,
  bigint,
  varchar,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

import { projects } from './projects.schema';
import { users } from './users.schema';

export const projectMembers = pgTable(
  'project_members',
  {
    id: integer('id')
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    uid: uuid('uid')
      .defaultRandom()
      .notNull()
      .unique(),

    project_id: bigint('project_id', {
      mode: 'number',
    })
      .notNull()
      .references(() => projects.id, {
        onDelete: 'cascade',
      }),

    user_id: bigint('user_id', {
      mode: 'number',
    })
      .notNull()
      .references(() => users.id, {
        onDelete: 'cascade',
      }),

    role_name: varchar('role_name', {
      length: 100,
    }).default('Member'),

    created_by: bigint('created_by', {
      mode: 'number',
    }),

    updated_by: bigint('updated_by', {
      mode: 'number',
    }),

    created_at: timestamp('created_at')
      .defaultNow(),

    updated_at: timestamp('updated_at')
      .defaultNow(),
  },
  (table) => ({
    uniqueProjectUser: unique().on(
      table.project_id,
      table.user_id,
    ),
  }),
);