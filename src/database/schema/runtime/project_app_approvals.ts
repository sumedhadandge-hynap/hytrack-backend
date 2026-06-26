import {
    integer,
    bigint,
    timestamp,
    pgTable,
    varchar,
    text,
} from 'drizzle-orm/pg-core';
import { projectAppRecords } from './project_app_records';
import { appSteps } from '../application-builder/app-steps.schema';


export const projectAppApprovals =
    pgTable('project_app_approvals', {

        id: integer('id')
            .primaryKey()
            .generatedAlwaysAsIdentity(),

        record_id: bigint('record_id', {
            mode: 'number',
        })
            .notNull()
            .references(
                () => projectAppRecords.id,
                {
                    onDelete: 'cascade',
                },
            ),

        step_id: bigint('step_id', {
            mode: 'number',
        })
            .notNull()
            .references(
                () => appSteps.id,
                {
                    onDelete: 'cascade',
                },
            ),

        approved_by: bigint('approved_by', {
            mode: 'number',
        }),

        status: varchar('status', {
            length: 50,
        }),

        remarks: text('remarks'),

        created_at: timestamp('created_at')
            .defaultNow(),
    });