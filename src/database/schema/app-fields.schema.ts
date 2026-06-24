import {
  pgTable,
  integer,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  bigint,
  jsonb,
} from 'drizzle-orm/pg-core';

import { apps } from './apps.schema';
import { appSteps } from './app-steps.schema';

export const appFields = pgTable('app_fields', {

  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  uid: uuid('uid')
    .defaultRandom()
    .notNull()
    .unique(),

  app_id: bigint('app_id', {
    mode: 'number',
  })
    .notNull()
    .references(() => apps.id, {
      onDelete: 'cascade',
    }),

  step_id: bigint('step_id', {
    mode: 'number',
  })
    .notNull()
    .references(() => appSteps.id, {
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

  // For Reference/Master fields
  reference_app_id: bigint('reference_app_id', {
    mode: 'number',
  }).references(() => apps.id),

  // Which field from the master app should be shown
  reference_display_field_id: bigint('reference_display_field_id', {
    mode: 'number',
  }),

  placeholder: text('placeholder'),

  help_text: text('help_text'),

  default_value: text('default_value'),

  dropdown_options: jsonb('dropdown_options'),

  validation_rules: jsonb('validation_rules'),

  is_required: boolean('is_required')
    .default(false),

  is_unique: boolean('is_unique')
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