import {
  boolean,
  jsonb,
  pgTable,
  uniqueIndex,
  varchar,
} from 'drizzle-orm/pg-core';

import { baseColumns } from '../common/common.schema';

export interface FieldTypeSettings {
  allowDefaultValue?: boolean;
  allowValidation?: boolean;
  allowOptions?: boolean;
  allowReference?: boolean;
  allowMultiple?: boolean;
  allowCalculation?: boolean;
}

export const fieldTypes = pgTable(
  'field_types',
  {
    ...baseColumns,

    name: varchar('name', {
      length: 100,
    }).notNull(),

    code: varchar('code', {
      length: 50,
    }).notNull(),

    description: varchar('description', {
      length: 500,
    }),

    category: varchar('category', {
      length: 50,
    }).notNull(),

    icon: varchar('icon', {
      length: 100,
    }),

    allowDefaultValue: boolean('allow_default_value')
      .notNull()
      .default(true),

    allowValidation: boolean('allow_validation')
      .notNull()
      .default(true),

    allowOptions: boolean('allow_options')
      .notNull()
      .default(false),

    allowReference: boolean('allow_reference')
      .notNull()
      .default(false),

    allowMultiple: boolean('allow_multiple')
      .notNull()
      .default(false),

    allowCalculation: boolean('allow_calculation')
      .notNull()
      .default(false),

    settings: jsonb('settings').$type<FieldTypeSettings>(),

    isSystem: boolean('is_system')
      .notNull()
      .default(true),
  },
  (table) => ({
    nameUnique: uniqueIndex('uq_field_types_name').on(table.name),

    codeUnique: uniqueIndex('uq_field_types_code').on(table.code),
  }),
);