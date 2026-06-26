import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';

import { projectApps } from './project-apps.schema';
import { appVersions } from '../application-builder/app-versions.schema';
import { users } from '../auth/users.schema';


export const projectAppUpgradeHistory = pgTable(
  'project_app_upgrade_history',
  {
    ...baseColumns,

    projectAppId: integer('project_app_id')
      .notNull()
      .references(() => projectApps.id, {
        onDelete: 'cascade',
      }),

    fromVersionId: integer('from_version_id')
      .notNull()
      .references(() => appVersions.id),

    toVersionId: integer('to_version_id')
      .notNull()
      .references(() => appVersions.id),

    upgradedBy: integer('upgraded_by')
      .notNull()
      .references(() => users.id),

    upgradedAt: timestamp('upgraded_at', {
      withTimezone: true,
    }).defaultNow(),

    status: varchar('status', {
      length: 20,
    })
      .notNull()
      .default('SUCCESS'),

    remarks: text('remarks'),
  },
  (table) => ({
    projectAppIdx: index(
      'idx_project_app_upgrade_project_app',
    ).on(table.projectAppId),

    fromVersionIdx: index(
      'idx_project_app_upgrade_from_version',
    ).on(table.fromVersionId),

    toVersionIdx: index(
      'idx_project_app_upgrade_to_version',
    ).on(table.toVersionId),
  }),
);