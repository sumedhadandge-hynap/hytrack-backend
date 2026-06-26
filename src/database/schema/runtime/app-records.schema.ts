import {
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';

import { projectApps } from './project-apps.schema';
import { appVersions } from '../application-builder/app-versions.schema';

export const appRecords = pgTable(
  'app_records',
  {
    ...baseColumns,

    projectAppId: integer('project_app_id')
      .notNull()
      .references(() => projectApps.id, {
        onDelete: 'cascade',
      }),

    versionId: integer('version_id')
      .notNull()
      .references(() => appVersions.id),

    recordNumber: varchar('record_number', {
      length: 100,
    }),

    status: varchar('status', {
      length: 30,
    })
      .notNull()
      .default('DRAFT'),

    submittedBy: integer('submitted_by'),

    submittedAt: timestamp('submitted_at', {
      withTimezone: true,
    }),
  },
  (table) => ({
    projectAppIdx: index('idx_app_records_project_app').on(
      table.projectAppId,
    ),

    versionIdx: index('idx_app_records_version').on(
      table.versionId,
    ),

    statusIdx: index('idx_app_records_status').on(
      table.status,
    ),

    recordNumberUnique: uniqueIndex(
      'uq_app_records_record_number',
    ).on(table.projectAppId, table.recordNumber),
  }),
);