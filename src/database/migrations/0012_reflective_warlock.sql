CREATE TABLE "app_versions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "app_versions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"app_id" bigint NOT NULL,
	"version_number" integer DEFAULT 1,
	"version_name" varchar(255) NOT NULL,
	"notes" text,
	"is_published" boolean DEFAULT false,
	"created_by" bigint,
	"updated_by" bigint,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "app_versions_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
ALTER TABLE "app_versions" ADD CONSTRAINT "app_versions_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;