import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';
import { apps } from './apps.schema';

export const appVersions = pgTable(
  'app_versions',
  {
    ...baseColumns,

    appId: integer('app_id')
      .notNull()
      .references(() => apps.id, {
        onDelete: 'cascade',
      }),

    version: integer('version')
      .notNull(),

    versionName: varchar('version_name', {
      length: 150,
    }).notNull(),

    description: text('description'),

    releaseNotes: text('release_notes'),

    isPublished: boolean('is_published')
      .notNull()
      .default(false),

    publishedBy: integer('published_by'),

    publishedAt: timestamp('published_at', {
      withTimezone: true,
    }),

    isCurrent: boolean('is_current')
      .notNull()
      .default(false),
  },
  (table) => ({
    appIdx: index('idx_app_versions_app').on(table.appId),

    currentIdx: index('idx_app_versions_current').on(table.isCurrent),

    uniqueVersion: uniqueIndex('uq_app_versions_app_version').on(
      table.appId,
      table.version,
    ),
  }),
);