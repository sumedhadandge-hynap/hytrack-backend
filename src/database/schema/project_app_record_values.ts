import {
  bigint,
  integer,
  jsonb,
  pgTable,
  timestamp,
} from 'drizzle-orm/pg-core';

import { projectAppRecords } from './project_app_records';
import { appFields } from './app-fields.schema';

export const projectAppRecordValues =
  pgTable('project_app_record_values', {
    id: integer('id')
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    record_id: bigint('record_id', {
      mode: 'number',
    })
      .notNull()
      .references(() => projectAppRecords.id, {
        onDelete: 'cascade',
      }),

    field_id: bigint('field_id', {
      mode: 'number',
    })
      .notNull()
      .references(() => appFields.id, {
        onDelete: 'restrict',
      }),

    value: jsonb('value'),

    created_at: timestamp('created_at')
      .defaultNow(),

    updated_at: timestamp('updated_at')
      .defaultNow(),
  });