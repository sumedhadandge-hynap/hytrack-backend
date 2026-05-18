import {
  pgTable,
  integer,
  bigint,
  varchar,
} from 'drizzle-orm/pg-core';

export const countries = pgTable('countries', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  iso3: varchar('iso3', { length: 3 }).unique(),
  iso2: varchar('iso2', { length: 2 }).unique(),
  phone_code: varchar('phone_code', { length: 20 }),
  capital: varchar('capital', { length: 255 }),
  currency: varchar('currency', { length: 50 }),
});

export const states = pgTable('states', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  country_id: bigint('country_id', { mode: 'number' })
    .notNull()
    .references(() => countries.id, { onDelete: 'cascade' }),
  state_code: varchar('state_code', { length: 50 }),
});

export const cities = pgTable('cities', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: varchar('name', { length: 255 }).notNull(),
  state_id: bigint('state_id', { mode: 'number' })
    .notNull()
    .references(() => states.id, { onDelete: 'cascade' }),
  country_id: bigint('country_id', { mode: 'number' })
    .notNull()
    .references(() => countries.id, { onDelete: 'cascade' }),
});
