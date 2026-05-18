ALTER TABLE "role_permissions" DROP CONSTRAINT "role_permissions_uid_unique";--> statement-breakpoint
ALTER TABLE "menus" DROP CONSTRAINT "menus_uid_unique";--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "permissions_uid_unique" UNIQUE("uid");--> statement-breakpoint
ALTER TABLE "menus" ADD CONSTRAINT "permissions_uid_unique" UNIQUE("uid");