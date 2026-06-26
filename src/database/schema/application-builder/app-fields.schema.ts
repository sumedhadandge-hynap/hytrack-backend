import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';
import { appFields } from './app-fields.schema';
import { appSteps } from './app-steps.schema';
import { appVersions } from './app-versions.schema';
import { apps } from './apps.schema';
import { fieldTypes } from './field-types.schema';

export interface ValidationRules {
  min?: number;
  max?: number;

  minLength?: number;
  maxLength?: number;

  pattern?: string;

  email?: boolean;

  phone?: boolean;

  allowNegative?: boolean;
}

export interface FieldSettings {
  searchable?: boolean;

  sortable?: boolean;

  filterable?: boolean;

  allowCopy?: boolean;

  allowScan?: boolean;

  multiple?: boolean;
}

export const appFields = pgTable(
  'app_fields',
  {
    ...baseColumns,

    versionId: integer('version_id')
      .notNull()
      .references(() => appVersions.id, {
        onDelete: 'cascade',
      }),

    stepId: integer('step_id')
      .notNull()
      .references(() => appSteps.id, {
        onDelete: 'cascade',
      }),

    fieldTypeId: integer('field_type_id')
      .notNull()
      .references(() => fieldTypes.id),

    label: varchar('label', {
      length: 150,
    }).notNull(),

    fieldKey: varchar('field_key', {
      length: 100,
    }).notNull(),

    placeholder: varchar('placeholder', {
      length: 255,
    }),

    helpText: text('help_text'),

    defaultValue: text('default_value'),

    /*
      Used only for
      Dropdown
      Radio
      Checkbox
      Multi Select
    */
    optionsJson: jsonb('options_json'),

    /*
      Used only for Reference field
    */
    referenceAppId: integer('reference_app_id').references(
      () => apps.id,
      {
        onDelete: 'set null',
      },
    ),

    /*
      Which field should be displayed
      Example:
      Vendor Name
    */
    referenceDisplayFieldId: integer(
      'reference_display_field_id',
    ).references(() => appFields.id, {
      onDelete: 'set null',
    }),

    validationJson: jsonb('validation_json').$type<ValidationRules>(),

    settingsJson: jsonb('settings_json').$type<FieldSettings>(),

    displayOrder: integer('display_order')
      .notNull()
      .default(1),

    isRequired: boolean('is_required')
      .notNull()
      .default(false),

    isUnique: boolean('is_unique')
      .notNull()
      .default(false),

    isVisible: boolean('is_visible')
      .notNull()
      .default(true),

    isEditable: boolean('is_editable')
      .notNull()
      .default(true),
  },
  (table) => ({
    versionIdx: index('idx_app_fields_version').on(table.versionId),

    stepIdx: index('idx_app_fields_step').on(table.stepId),

    fieldTypeIdx: index('idx_app_fields_type').on(table.fieldTypeId),

    referenceIdx: index('idx_app_fields_reference').on(
      table.referenceAppId,
    ),

    uniqueFieldKey: uniqueIndex(
      'uq_app_fields_version_key',
    ).on(table.versionId, table.fieldKey),
  }),
);