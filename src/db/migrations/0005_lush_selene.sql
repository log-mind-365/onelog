ALTER TYPE "public"."notification_types" ADD VALUE 'system';--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_article_id_articles_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_receiver_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_sender_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notifications_receiver_id_idx" ON "notifications" USING btree ("receiver_id");--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "article_id";--> statement-breakpoint
ALTER TABLE "notifications" DROP COLUMN "url";