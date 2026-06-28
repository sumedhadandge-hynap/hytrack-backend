CREATE TABLE "app_groups" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "app_groups_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"code" varchar(100) NOT NULL,
	"description" text,
	"icon_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" bigint,
	"updated_by" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "app_groups_uid_unique" UNIQUE("uid"),
	CONSTRAINT "app_groups_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "apps" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "apps" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "apps" ADD COLUMN "app_group_id" bigint;--> statement-breakpoint
ALTER TABLE "apps" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "apps" ADD CONSTRAINT "apps_app_group_id_app_groups_id_fk" FOREIGN KEY ("app_group_id") REFERENCES "public"."app_groups"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "apps" DROP COLUMN "is_published";--> statement-breakpoint
ALTER TABLE "apps" DROP COLUMN "version";