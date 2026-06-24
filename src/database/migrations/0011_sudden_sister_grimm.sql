ALTER TABLE "app_fields" ADD COLUMN "reference_app_id" bigint;--> statement-breakpoint
ALTER TABLE "app_fields" ADD COLUMN "reference_display_field_id" bigint;--> statement-breakpoint
ALTER TABLE "app_fields" ADD CONSTRAINT "app_fields_reference_app_id_apps_id_fk" FOREIGN KEY ("reference_app_id") REFERENCES "public"."apps"("id") ON DELETE no action ON UPDATE no action;