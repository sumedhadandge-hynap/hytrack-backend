ALTER TABLE "project_app_records" DROP CONSTRAINT "project_app_records_project_app_id_project_apps_id_fk";
--> statement-breakpoint
ALTER TABLE "project_app_runs" DROP CONSTRAINT "project_app_runs_project_app_id_project_apps_id_fk";
--> statement-breakpoint
ALTER TABLE "project_app_step_runs" DROP CONSTRAINT "project_app_step_runs_project_app_run_id_project_app_runs_id_fk";
--> statement-breakpoint
ALTER TABLE "project_app_step_values" DROP CONSTRAINT "project_app_step_values_step_run_id_project_app_step_runs_id_fk";
--> statement-breakpoint
ALTER TABLE "project_app_records" ADD CONSTRAINT "project_app_records_project_app_id_project_apps_id_fk" FOREIGN KEY ("project_app_id") REFERENCES "public"."project_apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_runs" ADD CONSTRAINT "project_app_runs_project_app_id_project_apps_id_fk" FOREIGN KEY ("project_app_id") REFERENCES "public"."project_apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_step_runs" ADD CONSTRAINT "project_app_step_runs_project_app_run_id_project_app_runs_id_fk" FOREIGN KEY ("project_app_run_id") REFERENCES "public"."project_app_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "project_app_step_values" ADD CONSTRAINT "project_app_step_values_step_run_id_project_app_step_runs_id_fk" FOREIGN KEY ("step_run_id") REFERENCES "public"."project_app_step_runs"("id") ON DELETE cascade ON UPDATE no action;