ALTER TABLE "project_app_record_values" DROP CONSTRAINT "project_app_record_values_field_id_app_fields_id_fk";
--> statement-breakpoint
ALTER TABLE "project_app_records" ADD COLUMN "version_id" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "project_app_records" ADD CONSTRAINT "project_app_records_version_id_app_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."app_versions"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_record_values" ADD CONSTRAINT "project_app_record_values_field_id_app_fields_id_fk" FOREIGN KEY ("field_id") REFERENCES "public"."app_fields"("id") ON DELETE restrict ON UPDATE no action;