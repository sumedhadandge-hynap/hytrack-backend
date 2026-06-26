import { relations } from 'drizzle-orm';

import { appRecordValues } from '../../schema/runtime/app-record-values.schema';
import { appRecords } from '../../schema/runtime/app-records.schema';
import { appFields } from '../../schema/application-builder/app-fields.schema';

export const appRecordValuesRelations = relations(
  appRecordValues,
  ({ one }) => ({
    record: one(appRecords, {
      fields: [appRecordValues.recordId],
      references: [appRecords.id],
    }),

    field: one(appFields, {
      fields: [appRecordValues.fieldId],
      references: [appFields.id],
    }),
  }),
);