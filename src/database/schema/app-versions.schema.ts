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

import { apps } from './apps.schema';

export const appVersions =
    pgTable('app_versions', {

        id: integer('id')
            .primaryKey()
            .generatedAlwaysAsIdentity(),

        uid: uuid('uid')
            .defaultRandom()
            .notNull()
            .unique(),

        app_id: bigint('app_id', {
            mode: 'number',
        })
            .notNull()
            .references(() => apps.id, {
                onDelete: 'cascade',
            }),

        version_number:
            integer('version_number')
                .default(1),

        version_name:
            varchar('version_name', {
                length: 255,
            }).notNull(),

        notes: text('notes'),

        is_published:
            boolean('is_published')
                .default(false),

        created_by: bigint(
            'created_by',
            {
                mode: 'number',
            },
        ),

        updated_by: bigint(
            'updated_by',
            {
                mode: 'number',
            },
        ),

        created_at:
            timestamp('created_at')
                .defaultNow(),

        updated_at:
            timestamp('updated_at')
                .defaultNow(),
    });