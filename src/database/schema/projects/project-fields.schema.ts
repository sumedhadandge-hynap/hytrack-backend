import {
  pgTable,
  integer,
  uuid,
  bigint,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

import { projects } from '../projects/projects.schema';
import { apps } from '../application-builder/apps.schema';

export const projectFields = pgTable('project_fields', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  uid: uuid('uid')
    .defaultRandom()
    .notNull()
    .unique(),

  project_id: bigint('project_id', {
    mode: 'number',
  })
    .notNull()
    .references(() => projects.id, {
      onDelete: 'cascade',
    }),

  label: varchar('label', {
    length: 255,
  }).notNull(),

  field_key: varchar('field_key', {
    length: 255,
  }).notNull(),

  field_type: varchar('field_type', {
    length: 100,
  }).notNull(),

  reference_app_id: bigint('reference_app_id', {
    mode: 'number',
  }).references(() => apps.id, {
    onDelete: 'set null',
  }),

  placeholder: text('placeholder'),

  default_value: text('default_value'),

  dropdown_options: jsonb('dropdown_options'),

  validation_rules: jsonb('validation_rules'),

  is_required: boolean('is_required')
    .default(false),

  is_visible: boolean('is_visible')
    .default(true),

  is_editable: boolean('is_editable')
    .default(true),

  order_index: integer('order_index')
    .default(0),

  created_by: bigint('created_by', {
    mode: 'number',
  }),

  updated_by: bigint('updated_by', {
    mode: 'number',
  }),

  created_at: timestamp('created_at')
    .defaultNow(),

  updated_at: timestamp('updated_at')
    .defaultNow(),
});