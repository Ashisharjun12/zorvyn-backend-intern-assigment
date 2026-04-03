CREATE TYPE "public"."record_type" AS ENUM('income', 'expense');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('viewer', 'analyst', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TABLE "records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"amount" integer NOT NULL,
	"type" "record_type" NOT NULL,
	"category" varchar(100) NOT NULL,
	"description" text,
	"date" timestamp DEFAULT now() NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar NOT NULL,
	"role" "user_role" DEFAULT 'viewer' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "records" ADD CONSTRAINT "records_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "records_user_id_idx" ON "records" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "records_type_idx" ON "records" USING btree ("type");--> statement-breakpoint
CREATE INDEX "records_category_idx" ON "records" USING btree ("category");--> statement-breakpoint
CREATE INDEX "records_date_idx" ON "records" USING btree ("date");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");


