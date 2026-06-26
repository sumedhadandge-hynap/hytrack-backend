import {
  boolean,
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';

import { projects } from '../projects/projects.schema';
import { apps } from '../application-builder/apps.schema';
import { appVersions } from '../application-builder/app-versions.schema';

export const projectApps = pgTable(
  'project_apps',
  {
    ...baseColumns,

    projectId: integer('project_id')
      .notNull()
      .references(() => projects.id, {
        onDelete: 'cascade',
      }),

    appId: integer('app_id')
      .notNull()
      .references(() => apps.id, {
        onDelete: 'cascade',
      }),

    installedVersionId: integer('installed_version_id')
      .notNull()
      .references(() => appVersions.id),

    status: varchar('status', {
      length: 30,
    })
      .notNull()
      .default('INSTALLED'),

    installedAt: timestamp('installed_at', {
      withTimezone: true,
    }).defaultNow(),

    installedBy: integer('installed_by'),

    updatedAtVersion: timestamp('updated_at_version', {
      withTimezone: true,
    }),
  },
  (table) => ({
    projectIdx: index('idx_project_apps_project').on(
      table.projectId,
    ),

    appIdx: index('idx_project_apps_app').on(
      table.appId,
    ),

    versionIdx: index('idx_project_apps_version').on(
      table.installedVersionId,
    ),

    uniqueProjectApp: uniqueIndex(
      'uq_project_apps_project_app',
    ).on(table.projectId, table.appId),
  }),
);