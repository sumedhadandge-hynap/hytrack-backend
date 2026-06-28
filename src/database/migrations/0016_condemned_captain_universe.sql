ALTER TABLE "app_groups" DROP CONSTRAINT "app_groups_code_unique";--> statement-breakpoint
CREATE UNIQUE INDEX "app_groups_code_unique" ON "app_groups" USING btree ("code");--> statement-breakpoint
CREATE UNIQUE INDEX "app_groups_uid_unique" ON "app_groups" USING btree ("uid");