CREATE TABLE "app_group_apps" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "app_group_apps_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"uid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"app_group_id" integer NOT NULL,
	"app_id" integer NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_by" bigint,
	"updated_by" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "app_group_apps_uid_unique" UNIQUE("uid")
);
--> statement-breakpoint
ALTER TABLE "app_group_apps" ADD CONSTRAINT "app_group_apps_app_group_id_app_groups_id_fk" FOREIGN KEY ("app_group_id") REFERENCES "public"."app_groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_group_apps" ADD CONSTRAINT "app_group_apps_app_id_apps_id_fk" FOREIGN KEY ("app_id") REFERENCES "public"."apps"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "app_group_apps_group_app_unique" ON "app_group_apps" USING btree ("app_group_id","app_id");--> statement-breakpoint
CREATE INDEX "app_group_apps_group_idx" ON "app_group_apps" USING btree ("app_group_id");--> statement-breakpoint
CREATE INDEX "app_group_apps_app_idx" ON "app_group_apps" USING btree ("app_id");