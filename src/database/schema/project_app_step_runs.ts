import { integer, bigint, timestamp, pgTable, varchar } from 'drizzle-orm/pg-core';

import {
    appSteps,
} from './app-steps.schema';

import {
    projectAppRuns,
} from './project_app_runs';




export const projectAppStepRuns = pgTable(
    'project_app_step_runs',
    {
        id: integer('id')
            .primaryKey()
            .generatedAlwaysAsIdentity(),

        project_app_run_id: bigint(
            'project_app_run_id',
            {
                mode: 'number',
            },
        )
            .notNull()
            .references(
                () => projectAppRuns.id,
            ),

        app_step_id: bigint(
            'app_step_id',
            {
                mode: 'number',
            },
        )
            .notNull()
            .references(
                () => appSteps.id,
            ),

        status: varchar('status', {
            length: 50,
        }).default('pending'),

        assigned_to: bigint(
            'assigned_to',
            {
                mode: 'number',
            },
        ),

        completed_by: bigint(
            'completed_by',
            {
                mode: 'number',
            },
        ),

        completed_at:
            timestamp('completed_at'),
    },
);