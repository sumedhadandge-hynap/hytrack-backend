import {
    pgTable,
    integer,
    uuid,
    varchar,
    text,
    timestamp,
    bigint,
    boolean,
} from 'drizzle-orm/pg-core';

import { appTypes } from './app-types.schema.js';

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
    }).notNull().unique(),

    description: text('description'),

    app_type_id: bigint('app_type_id', {
        mode: 'number',
    })
        .notNull()
        .references(() => appTypes.id, {
            onDelete: 'cascade',
        }),

    icon_url: text('icon_url'),

    is_published: boolean('is_published')
        .default(false),

    version: integer('version')
        .default(1),

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
});