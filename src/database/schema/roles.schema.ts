import {pgTable,integer,uuid,varchar,text,timestamp,} from 'drizzle-orm/pg-core';



export const roles = pgTable('roles', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

    uid: uuid('uid')
        .defaultRandom()
        .notNull()
        .unique(),

    name: varchar('name', { length: 100 })
        .notNull()
        .unique(),

    description: text('description'),

    created_at: timestamp('created_at')
        .defaultNow()
});