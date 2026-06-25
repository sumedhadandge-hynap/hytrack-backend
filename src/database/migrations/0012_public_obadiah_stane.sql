ALTER TABLE "countries" DROP CONSTRAINT "countries_iso3_unique";--> statement-breakpoint
ALTER TABLE "countries" DROP CONSTRAINT "countries_iso2_unique";--> statement-breakpoint
ALTER TABLE "states" DROP CONSTRAINT "states_country_id_countries_id_fk";
--> statement-breakpoint
ALTER TABLE "cities" ALTER COLUMN "state_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "cities" ALTER COLUMN "country_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "countries" ALTER COLUMN "phone_code" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "states" ALTER COLUMN "country_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN "code" text;--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN "created_by" integer;--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN "updated_by" integer;--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN "deleted_by" integer;--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "cities" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "countries" ADD COLUMN "iso_code" text NOT NULL;--> statement-breakpoint
ALTER TABLE "countries" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "countries" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "countries" ADD COLUMN "created_by" integer;--> statement-breakpoint
ALTER TABLE "countries" ADD COLUMN "updated_by" integer;--> statement-breakpoint
ALTER TABLE "countries" ADD COLUMN "deleted_by" integer;--> statement-breakpoint
ALTER TABLE "countries" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "countries" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "countries" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "states" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "states" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "states" ADD COLUMN "created_by" integer;--> statement-breakpoint
ALTER TABLE "states" ADD COLUMN "updated_by" integer;--> statement-breakpoint
ALTER TABLE "states" ADD COLUMN "deleted_by" integer;--> statement-breakpoint
ALTER TABLE "states" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "states" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "states" ADD COLUMN "deleted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "states" ADD CONSTRAINT "states_country_id_countries_id_fk" FOREIGN KEY ("country_id") REFERENCES "public"."countries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "countries" DROP COLUMN "iso3";--> statement-breakpoint
ALTER TABLE "countries" DROP COLUMN "iso2";--> statement-breakpoint
ALTER TABLE "countries" DROP COLUMN "capital";--> statement-breakpoint
ALTER TABLE "countries" DROP COLUMN "currency";