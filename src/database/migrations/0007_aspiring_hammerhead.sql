CREATE TABLE "project_members" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_members_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"project_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"role_name" varchar(100) DEFAULT 'Member',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "project_members_uid_unique" UNIQUE("uid"),
	CONSTRAINT "project_members_project_id_user_id_unique" UNIQUE("project_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "project_apps" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "project_apps_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"project_id" bigint NOT NULL,
	"app_id" bigint NOT NULL,
	"version_id" bigint,
	"status" varchar(50) DEFAULT 'installed',
	"installed_by" bigint,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "project_apps_uid_unique" UNIQUE("uid"),
	CONSTRAINT "project_apps_project_id_app_id_unique" UNIQUE("project_id","app_id")
);
--> statement-breakpoint
ALTER TABLE "project_fields" ADD COLUMN "reference_app_id" bigint;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_apps" ADD CONSTRAINT "project_apps_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_apps" ADD CONSTRAINT "project_apps_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_apps" ADD CONSTRAINT "project_apps_version_id_app_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."app_versions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_fields" ADD CONSTRAINT "project_fields_reference_app_id_apps_id_fk" FOREIGN KEY ("reference_app_id") REFERENCES "public"."apps"("id") ON DELETE set null ON UPDATE no action;