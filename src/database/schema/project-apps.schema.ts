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
import { apps } from './apps.schema';
import { appVersions } from './app-versions.schema';

export const projectApps = pgTable(
  'project_apps',
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

    app_id: bigint('app_id', {
      mode: 'number',
    })
      .notNull()
      .references(() => apps.id, {
        onDelete: 'cascade',
      }),

    version_id: bigint('version_id', {
      mode: 'number',
    }).references(() => appVersions.id, {
      onDelete: 'set null',
    }),

    status: varchar('status', {
      length: 50,
    }).default('installed'),

    installed_by: bigint('installed_by', {
      mode: 'number',
    }),

    created_at: timestamp('created_at')
      .defaultNow(),

    updated_at: timestamp('updated_at')
      .defaultNow(),
  },
  (table) => ({
    uniqueProjectApp: unique().on(
      table.project_id,
      table.app_id,
    ),
  }),
);