import {
  pgTable,
  integer,
  uuid,
  boolean,
  timestamp,
  bigint,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';

import { appGroups } from './app-groups.schema';
import { apps } from './apps.schema';

export const appGroupApps = pgTable(
  'app_group_apps',
  {
    id: integer('id')
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    uid: uuid('uid')
      .defaultRandom()
      .notNull()
      .unique(),

    app_group_id: integer('app_group_id')
      .notNull()
      .references(() => appGroups.id, {
        onDelete: 'cascade',
      }),

    app_id: integer('app_id')
      .notNull()
      .references(() => apps.id, {
        onDelete: 'cascade',
      }),

    sort_order: integer('sort_order')
      .default(0)
      .notNull(),

    is_active: boolean('is_active')
      .default(true)
      .notNull(),

    created_by: bigint('created_by', {
      mode: 'number',
    }),

    updated_by: bigint('updated_by', {
      mode: 'number',
    }),

    created_at: timestamp('created_at')
      .defaultNow()
      .notNull(),

    updated_at: timestamp('updated_at')
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqueGroupApp: uniqueIndex(
      'app_group_apps_group_app_unique',
    ).on(table.app_group_id, table.app_id),

    appGroupIdx: index(
      'app_group_apps_group_idx',
    ).on(table.app_group_id),

    appIdx: index(
      'app_group_apps_app_idx',
    ).on(table.app_id),
  }),
);