import {
  pgTable,
  integer,
  varchar,
  text,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

export const countries = pgTable('countries', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  name: varchar('name', { length: 255 })
    .notNull()
    .unique(),

  isoCode: text('iso_code').notNull(),

  phoneCode: text('phone_code'),

  description: text('description'),

  isActive: boolean('is_active')
    .notNull()
    .default(true),

  createdBy: integer('created_by'),

  updatedBy: integer('updated_by'),

  deletedBy: integer('deleted_by'),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  deletedAt: timestamp('deleted_at', {
    withTimezone: true,
  }),
});

export const states = pgTable('states', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  countryId: integer('country_id')
    .notNull()
    .references(() => countries.id),

  name: varchar('name', { length: 255 }).notNull(),

  stateCode: varchar('state_code', { length: 50 }),

  description: text('description'),

  isActive: boolean('is_active')
    .notNull()
    .default(true),

  createdBy: integer('created_by'),

  updatedBy: integer('updated_by'),

  deletedBy: integer('deleted_by'),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  deletedAt: timestamp('deleted_at', {
    withTimezone: true,
  }),
});

export const cities = pgTable('cities', {
  id: integer('id')
    .primaryKey()
    .generatedAlwaysAsIdentity(),

  countryId: integer('country_id')
    .notNull()
    .references(() => countries.id, {
      onDelete: 'cascade',
    }),

  stateId: integer('state_id')
    .notNull()
    .references(() => states.id, {
      onDelete: 'cascade',
    }),

  name: varchar('name', { length: 255 }).notNull(),

  code: text('code'),

  description: text('description'),

  isActive: boolean('is_active')
    .notNull()
    .default(true),

  createdBy: integer('created_by'),

  updatedBy: integer('updated_by'),

  deletedBy: integer('deleted_by'),

  createdAt: timestamp('created_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  deletedAt: timestamp('deleted_at', {
    withTimezone: true,
  }),
});