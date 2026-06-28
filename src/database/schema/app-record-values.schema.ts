import {
  pgTable,
  integer,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

import { appRecords } from './app-records.schema';
import { appFields } from './app-fields.schema';

export const appRecordValues = pgTable(
  'app_record_values',
  {
    id: integer('id')
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    record_id: integer('record_id')
      .notNull()
      .references(() => appRecords.id, {
        onDelete: 'cascade',
      }),

    field_id: integer('field_id')
      .notNull()
      .references(() => appFields.id, {
        onDelete: 'restrict',
      }),

    value: jsonb('value'),

    created_at: timestamp('created_at')
      .defaultNow(),
  },
);