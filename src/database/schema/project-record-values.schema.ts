import {
  pgTable,
  integer,
  bigint,
  jsonb,
  timestamp,
} from 'drizzle-orm/pg-core';

import { projects } from './projects.schema';
import { projectFields } from './project-fields.schema';

export const projectRecordValues =
  pgTable('project_record_values', {
    id: integer('id')
      .primaryKey()
      .generatedAlwaysAsIdentity(),

    project_id: bigint('project_id', {
      mode: 'number',
    })
      .notNull()
      .references(() => projects.id, {
        onDelete: 'cascade',
      }),

    field_id: bigint('field_id', {
      mode: 'number',
    })
      .notNull()
      .references(() => projectFields.id, {
        onDelete: 'cascade',
      }),

    value: jsonb('value'),

    created_at: timestamp('created_at')
      .defaultNow(),

    updated_at: timestamp('updated_at')
      .defaultNow(),
  });