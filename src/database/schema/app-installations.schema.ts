import {
  pgTable,
  integer,
  uuid,
  varchar,
  timestamp,
  bigint,
  boolean,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

import { apps } from './apps.schema';
import { appVersions } from './app-versions.schema';

export const appInstallations = pgTable(
  'app_installations',
  {
    id: integer('id')
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    uid: uuid('uid')
      .defaultRandom()
      .notNull()
      .unique(),

    app_id: integer('app_id')
      .notNull()
      .references(() => apps.id, {
        onDelete: 'cascade',
      }),

    version_id: integer('version_id')
      .notNull()
      .references(() => appVersions.id, {
        onDelete: 'restrict',
      }),

    install_type: varchar('install_type', {
      length: 50,
    }).notNull(),
    // master / standard

    scope_type: varchar('scope_type', {
      length: 50,
    }).notNull(),
    // global / company / project

    scope_id: bigint('scope_id', {
      mode: 'number',
    })
      .default(0)
      .notNull(),

    company_id: bigint('company_id', {
      mode: 'number',
    }),

    project_id: bigint('project_id', {
      mode: 'number',
    }),

    is_active: boolean('is_active')
      .default(true)
      .notNull(),

    installed_by: bigint('installed_by', {
      mode: 'number',
    }),

    updated_by: bigint('updated_by', {
      mode: 'number',
    }),

    installed_at: timestamp('installed_at')
      .defaultNow()
      .notNull(),

    updated_at: timestamp('updated_at')
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqueInstallation: uniqueIndex(
      'app_installations_unique',
    ).on(
      table.app_id,
      table.install_type,
      table.scope_type,
      table.scope_id,
    ),

    appIdx: index('app_installations_app_idx').on(
      table.app_id,
    ),

    versionIdx: index(
      'app_installations_version_idx',
    ).on(table.version_id),
  }),
);