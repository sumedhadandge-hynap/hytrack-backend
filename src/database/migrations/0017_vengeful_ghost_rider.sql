DROP INDEX "app_groups_code_unique";--> statement-breakpoint
DROP INDEX "app_groups_uid_unique";--> statement-breakpoint
ALTER TABLE "app_groups" ADD CONSTRAINT "app_groups_code_unique" UNIQUE("code");