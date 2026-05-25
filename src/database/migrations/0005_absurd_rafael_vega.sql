ALTER TABLE "app_steps" DROP CONSTRAINT "app_steps_app_id_apps_id_fk";
--> statement-breakpoint
ALTER TABLE "app_steps" ADD COLUMN "version_id" bigint NOT NULL;--> statement-breakpoint
ALTER TABLE "step_approvers" ADD COLUMN "approval_type" varchar(50) DEFAULT 'any';--> statement-breakpoint
ALTER TABLE "step_approvers" ADD COLUMN "rejection_action" varchar(50) DEFAULT 'previous';--> statement-breakpoint
ALTER TABLE "step_approvers" ADD COLUMN "order_index" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "app_steps" ADD CONSTRAINT "app_steps_version_id_app_versions_id_fk" FOREIGN KEY ("version_id") REFERENCES "public"."app_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_steps" DROP COLUMN "app_id";