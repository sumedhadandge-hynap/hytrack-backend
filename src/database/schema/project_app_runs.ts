import {
    integer,
    bigint,
    timestamp,
    pgTable,
    varchar,
} from 'drizzle-orm/pg-core';

import { projects } from './projects.schema';
import { projectApps } from './project-apps.schema';



export const projectAppRuns = pgTable(
    'project_app_runs',
    {
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
        }).default('pending'),

        started_by: bigint('started_by', {
            mode: 'number',
        }),

        completed_by: bigint('completed_by', {
            mode: 'number',
        }),

        started_at: timestamp('started_at'),

        completed_at: timestamp('completed_at'),

        created_at: timestamp('created_at')
            .defaultNow(),
    },
);