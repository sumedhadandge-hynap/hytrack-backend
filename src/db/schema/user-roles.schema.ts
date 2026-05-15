import { integer, pgTable, uuid, timestamp, bigint } from "drizzle-orm/pg-core";
import { users } from "./users.schema";
import { roles } from "./roles.schema";




export const userRoles = pgTable('user_roles', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

    uid: uuid('uid')
        .defaultRandom()
        .notNull()
        .unique(),

    user_id: bigint('user_id', { mode: 'number' })
        .notNull()
        .references(() => users.id, {
            onDelete: 'cascade',
        }),

    role_id: bigint('role_id', { mode: 'number' })
        .notNull()
        .references(() => roles.id, {
            onDelete: 'cascade',
        }),

    assigned_by: bigint('assigned_by', {
        mode: 'number',
    }),

    created_at: timestamp('created_at')
        .defaultNow(),
});