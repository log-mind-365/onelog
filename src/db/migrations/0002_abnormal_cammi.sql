ALTER TABLE "notifications" ADD COLUMN "message" text NOT NULL;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "url" text;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "metadata" jsonb;