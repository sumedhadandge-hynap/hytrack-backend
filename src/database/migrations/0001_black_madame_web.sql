CREATE TABLE "permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(100) NOT NULL,
	"module" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "permissions_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "menus" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"route" varchar(255) NOT NULL,
	"icon" varchar(100),
	"parent_id" integer,
	"order_index" integer DEFAULT 0,
	"is_visible" boolean DEFAULT true,
	"permission_code" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "role_permissions" ALTER COLUMN "id" SET DATA TYPE serial;--> statement-breakpoint
ALTER TABLE "role_permissions" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "role_permissions" ALTER COLUMN "role_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD COLUMN "permission_id" integer;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD COLUMN "can_update" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permission_id_permissions_id_fk" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_permissions" DROP COLUMN "permission_code";--> statement-breakpoint
ALTER TABLE "role_permissions" DROP COLUMN "can_edit";