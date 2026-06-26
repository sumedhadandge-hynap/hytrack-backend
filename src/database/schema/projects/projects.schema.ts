import {
  pgTable,
  integer,
  uuid,
  varchar,
  text,
  timestamp,
  bigint,
} from 'drizzle-orm/pg-core';

import { companies } from '../company/companies.schema';
import { countries, states, cities } from '../masters/master.schema';

export const projects = pgTable('projects', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  uid: uuid('uid')
    .defaultRandom()
    .notNull()
    .unique(),

  company_id: bigint('company_id', {
    mode: 'number',
  })
    .notNull()
    .references(() => companies.id, {
      onDelete: 'cascade',
    }),

  name: varchar('name', {
    length: 255,
  }).notNull(),

  description: text('description'),

  thumbnail_url: text('thumbnail_url'),

  address: text('address'),

  google_map_link: text('google_map_link'),

  start_date: timestamp('start_date'),

  end_date: timestamp('end_date'),

  country_id: bigint('country_id', {
    mode: 'number',
  }).references(() => countries.id),

  state_id: bigint('state_id', {
    mode: 'number',
  }).references(() => states.id),

  city_id: bigint('city_id', {
    mode: 'number',
  }).references(() => cities.id),

  status: varchar('status', {
    length: 50,
  }).default('draft'),

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