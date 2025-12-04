CREATE TYPE "public"."notification_types" AS ENUM('like', 'comment', 'follow');--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"receiver_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"type" "notification_types" NOT NULL,
	"article_id" integer,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notifications" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_receiver_id_users_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_article_id_articles_id_fk" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "authenticated can select own notifications" ON "notifications" AS PERMISSIVE FOR SELECT TO "authenticated" USING (receiver_id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can insert notification" ON "notifications" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (sender_id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can update own notifications" ON "notifications" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (receiver_id = auth.uid()) WITH CHECK (receiver_id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can delete own notifications" ON "notifications" AS PERMISSIVE FOR DELETE TO "authenticated" USING (receiver_id = auth.uid());