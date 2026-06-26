import {
  index,
  integer,
  pgTable,
  varchar,
  bigint,
} from 'drizzle-orm/pg-core';
import { baseColumns, users } from 'src/database/schema';
import { appStepRuns } from 'src/database/schema/runtime/app-step-runs.schema';


export const stepAttachments = pgTable(
  'step_attachments',
  {
    ...baseColumns,

    stepRunId: integer('step_run_id')
      .notNull()
      .references(() => appStepRuns.id, {
        onDelete: 'cascade',
      }),

    uploadedBy: integer('uploaded_by')
      .notNull()
      .references(() => users.id),

    fileName: varchar('file_name', {
      length: 255,
    }).notNull(),

    originalName: varchar('original_name', {
      length: 255,
    }).notNull(),

    extension: varchar('extension', {
      length: 20,
    }),

    mimeType: varchar('mime_type', {
      length: 100,
    }),

    fileSize: bigint('file_size', {
      mode: 'number',
    }),

    storagePath: varchar('storage_path', {
      length: 500,
    }).notNull(),

    storageType: varchar('storage_type', {
      length: 20,
    })
      .notNull()
      .default('LOCAL'),
  },
  (table) => ({
    stepIdx: index('idx_step_attachments_step').on(
      table.stepRunId,
    ),

    uploadedIdx: index('idx_step_attachments_uploaded_by').on(
      table.uploadedBy,
    ),
  }),
);