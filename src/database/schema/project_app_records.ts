import {
    pgTable,
    integer,
    bigint,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';

import { projects } from './projects.schema';
import { projectApps } from './project-apps.schema';

export const projectAppRecords =
    pgTable('project_app_records', {

        id: integer('id')
            .primaryKey()
            .generatedAlwaysAsIdentity(),

        project_id: bigint('project_id', {
            mode: 'number',
        })
            .notNull()
            .references(() => projects.id),

        project_app_id: bigint('project_app_id', {
            mode: 'number',
        })
            .notNull()
            .references(() => projectApps.id),

        status: varchar('status', {
            length: 50,
        }).default('draft'),

        started_by: bigint('started_by', {
            mode: 'number',
        }),

        created_at: timestamp('created_at')
            .defaultNow(),

        updated_at: timestamp('updated_at')
            .defaultNow(),
    });