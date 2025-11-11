CREATE TABLE "user_follows" (
	"id" uuid DEFAULT gen_random_uuid() NOT NULL,
	"follower_id" uuid NOT NULL,
	"following_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_follows_follower_id_following_id_pk" PRIMARY KEY("follower_id","following_id")
);
--> statement-breakpoint
ALTER TABLE "user_follows" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" DROP CONSTRAINT "user_info_id_fk";
--> statement-breakpoint
ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_follower_id_users_id_fk" FOREIGN KEY ("follower_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE POLICY "anyone can select user follows" ON "user_follows" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can insert user follows" ON "user_follows" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (follower_id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can delete own user follows" ON "user_follows" AS PERMISSIVE FOR DELETE TO "authenticated" USING (follower_id = auth.uid());