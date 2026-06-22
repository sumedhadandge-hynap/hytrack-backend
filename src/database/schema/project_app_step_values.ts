import {
    integer,
    bigint,
    timestamp,
    pgTable,
    jsonb,
} from 'drizzle-orm/pg-core';


import {
    appFields,
} from './app-fields.schema';

import {
    projectAppStepRuns,
} from './project_app_step_runs';




export const projectAppStepValues =
    pgTable(
        'project_app_step_values',
        {
            id: integer('id')
                .primaryKey()
                .generatedAlwaysAsIdentity(),

            step_run_id: bigint(
                'step_run_id',
                {
                    mode: 'number',
                },
            )
                .notNull()
                .references(
                    () =>
                        projectAppStepRuns.id,
                    {
                        onDelete: 'cascade',
                    },
                ),

            field_id: bigint('field_id', {
                mode: 'number',
            })
                .notNull()
                .references(
                    () => appFields.id,
                ),

            value: jsonb('value'),

            created_at:
                timestamp('created_at')
                    .defaultNow(),
        },
    );