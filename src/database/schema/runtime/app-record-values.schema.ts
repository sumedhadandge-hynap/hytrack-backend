import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';

import { appRecords } from './app-records.schema';
import { appFields } from '../application-builder/app-fields.schema';

export const appRecordValues = pgTable(
  'app_record_values',
  {
    ...baseColumns,

    recordId: integer('record_id')
      .notNull()
      .references(() => appRecords.id, {
        onDelete: 'cascade',
      }),

    fieldId: integer('field_id')
      .notNull()
      .references(() => appFields.id),

    /*
      Store everything as text.

      Text
      Number
      Date
      Email
      Phone
      Reference Id
      File Path
    */
    value: text('value'),

    /*
      Useful for reference fields.

      Example

      value = 15

      displayValue = "ABC Pvt Ltd"
    */
    displayValue: text('display_value'),

    /*
      Extra metadata if needed.

      File

      {
        name,
        size,
        mime
      }

      Location

      {
        lat,
        lng
      }
    */
    metadata: jsonb('metadata'),
  },
  (table) => ({
    recordIdx: index('idx_app_record_values_record').on(
      table.recordId,
    ),

    fieldIdx: index('idx_app_record_values_field').on(
      table.fieldId,
    ),

    uniqueFieldPerRecord: uniqueIndex(
      'uq_app_record_values_record_field',
    ).on(table.recordId, table.fieldId),
  }),
);