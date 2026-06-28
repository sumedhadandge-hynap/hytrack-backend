CREATE TABLE "app_installations" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "app_installations_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"app_id" integer NOT NULL,
	"version_id" integer NOT NULL,
	"install_type" varchar(50) NOT NULL,
	"scope_type" varchar(50) NOT NULL,
	"scope_id" bigint DEFAULT 0 NOT NULL,
	"company_id" bigint,
	"project_id" bigint,
	"is_active" boolean DEFAULT true NOT NULL,
	"installed_by" bigint,
	"updated_by" bigint,
	"installed_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "app_installations_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
ALTER TABLE "app_records" DROP CONSTRAINT "app_records_app_id_apps_id_fk";
--> statement-breakpoint
ALTER TABLE "app_records" DROP CONSTRAINT "app_records_version_id_app_versions_id_fk";
--> statement-breakpoint
ALTER TABLE "app_record_values" DROP CONSTRAINT "app_record_values_field_id_app_fields_id_fk";
--> statement-breakpoint
ALTER TABLE "app_records" ALTER COLUMN "app_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "app_records" ALTER COLUMN "app_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "app_records" ALTER COLUMN "version_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "app_record_values" ALTER COLUMN "record_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "app_record_values" ALTER COLUMN "record_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "app_record_values" ALTER COLUMN "field_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "app_record_values" ALTER COLUMN "field_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "app_installations" ADD CONSTRAINT "app_installations_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_installations" ADD CONSTRAINT "app_installations_version_id_app_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."app_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "app_installations_unique" ON "app_installations" USING btree ("app_id","install_type","scope_type","scope_id");--> statement-breakpoint
CREATE INDEX "app_installations_app_idx" ON "app_installations" USING btree ("app_id");--> statement-breakpoint
CREATE INDEX "app_installations_version_idx" ON "app_installations" USING btree ("version_id");--> statement-breakpoint
ALTER TABLE "app_records" ADD CONSTRAINT "app_records_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_records" ADD CONSTRAINT "app_records_version_id_app_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."app_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_record_values" ADD CONSTRAINT "app_record_values_field_id_app_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."app_fields"("id") ON DELETE restrict ON UPDATE no action;