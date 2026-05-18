CREATE TABLE "audit_logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "audit_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer,
	"action" varchar(255) NOT NULL,
	"module" varchar(100) NOT NULL,
	"payload" json,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "companies" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "companies_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" bigint,
	"is_main" boolean DEFAULT false,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255),
	"email" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"website" varchar(500),
	"address" text,
	"description" text,
	"logo_url" text,
	"favicon_url" text,
	"country_id" bigint,
	"state_id" bigint,
	"city_id" bigint,
	"custom_fields" jsonb,
	"status" varchar(50) DEFAULT 'active',
	"is_deleted" boolean DEFAULT false,
	"company_code" varchar(50),
	"created_by" bigint,
	"updated_by" bigint,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "companies_uid_unique" UNIQUE("uid"),
	CONSTRAINT "companies_name_unique" UNIQUE("name"),
	CONSTRAINT "companies_slug_unique" UNIQUE("slug"),
	CONSTRAINT "companies_email_unique" UNIQUE("email"),
	CONSTRAINT "companies_phone_unique" UNIQUE("phone"),
	CONSTRAINT "companies_company_code_unique" UNIQUE("company_code")
);
--> statement-breakpoint
CREATE TABLE "permissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_by" integer,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(100) NOT NULL,
	"module" varchar(100) NOT NULL,
	"description" text,
	CONSTRAINT "permissions_uid_unique" UNIQUE("uid"),
	CONSTRAINT "permissions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "menus" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "menus_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_by" integer,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"name" varchar(100) NOT NULL,
	"route" varchar(255) NOT NULL,
	"icon" varchar(100),
	"parent_id" integer,
	"order_index" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"permission_code" varchar(100),
	CONSTRAINT "permissions_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "role_permissions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "role_permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"created_by" integer,
	"updated_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"role_id" integer,
	"permission_id" integer,
	"can_view" boolean DEFAULT true,
	"can_create" boolean DEFAULT false,
	"can_update" boolean DEFAULT false,
	"can_delete" boolean DEFAULT false,
	CONSTRAINT "permissions_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "roles_uid_unique" UNIQUE("uid"),
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" bigint NOT NULL,
	"role_id" bigint NOT NULL,
	"assigned_by" bigint,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_roles_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"company_id" bigint NOT NULL,
	"first_name" varchar(100) NOT NULL,
	"last_name" varchar(100),
	"email" varchar(255) NOT NULL,
	"mobile" varchar(20),
	"password_hash" text NOT NULL,
	"profile_image_url" text,
	"status" varchar(50) DEFAULT 'active',
	"is_active" boolean DEFAULT true,
	"is_super_admin" boolean DEFAULT false,
	"last_login" timestamp,
	"created_by" bigint,
	"updated_by" bigint,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_uid_unique" UNIQUE("uid"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_mobile_unique" UNIQUE("mobile")
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"state_id" bigint NOT NULL,
	"country_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "countries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "countries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"iso3" varchar(3),
	"iso2" varchar(2),
	"phone_code" varchar(20),
	"capital" varchar(255),
	"currency" varchar(50),
	CONSTRAINT "countries_name_unique" UNIQUE("name"),
	CONSTRAINT "countries_iso3_unique" UNIQUE("iso3"),
	CONSTRAINT "countries_iso2_unique" UNIQUE("iso2")
);
--> statement-breakpoint
CREATE TABLE "states" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "states_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"country_id" bigint NOT NULL,
	"state_code" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_parent_id_companies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "companies" ADD CONSTRAINT "companies_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cities" ADD CONSTRAINT "cities_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "states" ADD CONSTRAINT "states_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE cascade ON UPDATE no action;