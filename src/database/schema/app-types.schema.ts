import {
    pgTable,
    integer,
    uuid,
    varchar,
    text,
    timestamp,
    bigint,
} from 'drizzle-orm/pg-core';

export const appTypes = pgTable('app_types', {
    id: integer('id')
        .primaryKey()
        .generatedAlwaysAsIdentity(),

    uid: uuid('uid')
        .defaultRandom()
        .notNull()
        .unique(),

    name: varchar('name', {
        length: 100,
    }).notNull(),

    code: varchar('code', {
        length: 100,
    }).notNull().unique(),

    description: text('description'),

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