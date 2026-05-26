CREATE TABLE "projects" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"company_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"thumbnail_url" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"country_id" bigint,
	"state_id" bigint,
	"city_id" bigint,
	"status" varchar(50) DEFAULT 'draft',
	"created_by" bigint,
	"updated_by" bigint,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "projects_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "project_fields" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_fields_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"project_id" bigint NOT NULL,
	"label" varchar(255) NOT NULL,
	"field_key" varchar(255) NOT NULL,
	"field_type" varchar(100) NOT NULL,
	"placeholder" text,
	"default_value" text,
	"dropdown_options" jsonb,
	"validation_rules" jsonb,
	"is_required" boolean DEFAULT false,
	"is_visible" boolean DEFAULT true,
	"is_editable" boolean DEFAULT true,
	"order_index" integer DEFAULT 0,
	"created_by" bigint,
	"updated_by" bigint,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "project_fields_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
CREATE TABLE "project_record_values" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_record_values_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_id" bigint NOT NULL,
	"field_id" bigint NOT NULL,
	"value" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_state_id_states_id_fk" FOREIGN KEY ("state_id") REFERENCES "public"."states"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_fields" ADD CONSTRAINT "project_fields_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_record_values" ADD CONSTRAINT "project_record_values_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_record_values" ADD CONSTRAINT "project_record_values_field_id_project_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."project_fields"("id") ON DELETE cascade ON UPDATE no action;