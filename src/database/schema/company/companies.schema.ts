import {
  pgTable,
  integer,
  bigint,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';
import { countries, states, cities } from '../masters/master.schema';

export const companies = pgTable('companies', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  uid: uuid('uid').defaultRandom().notNull().unique(),
  parent_id: bigint('parent_id', { mode: 'number' }).references(
    (): any => companies.id,
    {
      onDelete: 'cascade',
    },
  ),
  is_main: boolean('is_main').default(false),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).unique(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull().unique(),
  website: varchar('website', { length: 500 }),
  address: text('address'),
  description: text('description'),
  logo_url: text('logo_url'),
  favicon_url: text('favicon_url'),
  country_id: bigint('country_id', { mode: 'number' }).references(
    () => countries.id,
  ),
  state_id: bigint('state_id', { mode: 'number' }).references(
    () => states.id,
  ),
  city_id: bigint('city_id', { mode: 'number' }).references(
    () => cities.id,
  ),
  custom_fields: jsonb('custom_fields'),
  status: varchar('status', { length: 50 }).default('active'),
  is_deleted: boolean('is_deleted').default(false),
  company_code: varchar('company_code', { length: 50 }).unique(),
  created_by: bigint('created_by', { mode: 'number' }),
  updated_by: bigint('updated_by', { mode: 'number' }),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});
