ALTER TABLE "audit_logs" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "audit_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "role_permissions" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "role_permissions" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "role_permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "permissions" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "permissions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "menus" ALTER COLUMN "id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "menus" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (sequence name "menus_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "role_permissions" ADD COLUMN "uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD COLUMN "created_by" integer;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD COLUMN "updated_by" integer;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "created_by" integer;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "updated_by" integer;--> statement-breakpoint
ALTER TABLE "permissions" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "menus" ADD COLUMN "uid" uuid DEFAULT gen_random_uuid() NOT NULL;--> statement-breakpoint
ALTER TABLE "menus" ADD COLUMN "created_by" integer;--> statement-breakpoint
ALTER TABLE "menus" ADD COLUMN "updated_by" integer;--> statement-breakpoint
ALTER TABLE "menus" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_uid_unique" UNIQUE("uid");--> statement-breakpoint
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_uid_unique" UNIQUE("uid");--> statement-breakpoint
ALTER TABLE "menus" ADD CONSTRAINT "menus_uid_unique" UNIQUE("uid");