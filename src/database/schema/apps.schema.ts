

import {
    pgTable,
    integer,
    uuid,
    varchar,
    text,
    bigint,
    timestamp,
    boolean,
} from 'drizzle-orm/pg-core';

import { appTypes } from './app-types.schema';
import { appGroups } from './app-groups.schema';

export const apps = pgTable('apps', {
    id: integer('id')
        .primaryKey()
        .generatedAlwaysAsIdentity(),

    uid: uuid('uid')
        .defaultRandom()
        .notNull()
        .unique(),

    name: varchar('name', {
        length: 255,
    }).notNull(),

    code: varchar('code', {
        length: 255,
    })
        .notNull()
        .unique(),

    description: text('description'),

    app_type_id: bigint('app_type_id', {
        mode: 'number',
    })
        .notNull()
        .references(() => appTypes.id, {
            onDelete: 'cascade',
        }),

    app_group_id: bigint('app_group_id', {
        mode: 'number',
    }).references(() => appGroups.id, {
        onDelete: 'set null',
    }),

    icon_url: text('icon_url'),

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
});