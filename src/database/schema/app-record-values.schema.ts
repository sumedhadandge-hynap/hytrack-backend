import {
  pgTable,
  integer,
  bigint,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';

import { appRecords } from './app-records.schema';
import { appFields } from './app-fields.schema';

export const appRecordValues = pgTable(
  'app_record_values',
  {

    id: integer('id')
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    record_id: bigint('record_id', {
      mode: 'number',
    })
      .references(() => appRecords.id, {
        onDelete: 'cascade',
      }),

    field_id: bigint('field_id', {
      mode: 'number',
    })
      .references(() => appFields.id, {
        onDelete: 'cascade',
      }),

    value: jsonb('value'),

    created_at: timestamp('created_at')
      .defaultNow(),
  },
);