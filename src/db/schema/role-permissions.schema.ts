import { integer, pgTable, timestamp, bigint, boolean, varchar } from "drizzle-orm/pg-core";
import { roles } from "./roles.schema";




export const rolePermissions = pgTable('role_permissions', {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),

    role_id: bigint('role_id', {
        mode: 'number',
    })
        .notNull()
        .references(() => roles.id, {
            onDelete: 'cascade',
        }),

    permission_code: varchar('permission_code', {
        length: 100,
    }).notNull(),

    can_view: boolean('can_view')
        .default(true),

    can_create: boolean('can_create')
        .default(false),

    can_edit: boolean('can_edit')
        .default(false),

    can_delete: boolean('can_delete')
        .default(false),

    created_at: timestamp('created_at')
        .defaultNow(),
});