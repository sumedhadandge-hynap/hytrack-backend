CREATE TABLE "project_app_records" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_app_records_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_id" bigint NOT NULL,
	"project_app_id" bigint NOT NULL,
	"status" varchar(50) DEFAULT 'draft',
	"started_by" bigint,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_app_record_values" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_app_record_values_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"record_id" bigint NOT NULL,
	"field_id" bigint NOT NULL,
	"value" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_app_approvals" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_app_approvals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"record_id" bigint NOT NULL,
	"step_id" bigint NOT NULL,
	"approved_by" bigint,
	"status" varchar(50),
	"remarks" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_app_runs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_app_runs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_id" bigint NOT NULL,
	"project_app_id" bigint NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"started_by" bigint,
	"completed_by" bigint,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_app_step_runs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_app_step_runs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"project_app_run_id" bigint NOT NULL,
	"app_step_id" bigint NOT NULL,
	"status" varchar(50) DEFAULT 'pending',
	"assigned_to" bigint,
	"completed_by" bigint,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "project_app_step_values" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_app_step_values_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"step_run_id" bigint NOT NULL,
	"field_id" bigint NOT NULL,
	"value" jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "project_app_records" ADD CONSTRAINT "project_app_records_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_records" ADD CONSTRAINT "project_app_records_project_app_id_project_apps_id_fk" FOREIGN KEY ("project_app_id") REFERENCES "public"."project_apps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_record_values" ADD CONSTRAINT "project_app_record_values_record_id_project_app_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."project_app_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_record_values" ADD CONSTRAINT "project_app_record_values_field_id_app_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."app_fields"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_approvals" ADD CONSTRAINT "project_app_approvals_record_id_project_app_records_id_fk" FOREIGN KEY ("record_id") REFERENCES "public"."project_app_records"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_approvals" ADD CONSTRAINT "project_app_approvals_step_id_app_steps_id_fk" FOREIGN KEY ("step_id") REFERENCES "public"."app_steps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_runs" ADD CONSTRAINT "project_app_runs_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_runs" ADD CONSTRAINT "project_app_runs_project_app_id_project_apps_id_fk" FOREIGN KEY ("project_app_id") REFERENCES "public"."project_apps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_step_runs" ADD CONSTRAINT "project_app_step_runs_project_app_run_id_project_app_runs_id_fk" FOREIGN KEY ("project_app_run_id") REFERENCES "public"."project_app_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_step_runs" ADD CONSTRAINT "project_app_step_runs_app_step_id_app_steps_id_fk" FOREIGN KEY ("app_step_id") REFERENCES "public"."app_steps"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_step_values" ADD CONSTRAINT "project_app_step_values_step_run_id_project_app_step_runs_id_fk" FOREIGN KEY ("step_run_id") REFERENCES "public"."project_app_step_runs"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_step_values" ADD CONSTRAINT "project_app_step_values_field_id_app_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."app_fields"("id") ON DELETE no action ON UPDATE no action;