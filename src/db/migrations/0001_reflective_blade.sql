ALTER TABLE "article_likes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "comments" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "reports" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER POLICY "authenticated can view all articles" ON "articles" RENAME TO "anyone can select public articles";--> statement-breakpoint
ALTER POLICY "authenticated can update articles" ON "articles" RENAME TO "authenticated can select own articles";--> statement-breakpoint
ALTER POLICY "authenticated can delete articles" ON "articles" RENAME TO "authenticated can update own articles";--> statement-breakpoint
DROP POLICY "authenticated can view all user_info" ON "profiles" CASCADE;--> statement-breakpoint
DROP POLICY "authenticated can update user_info" ON "profiles" CASCADE;--> statement-breakpoint
CREATE POLICY "anyone can select article likes" ON "article_likes" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can insert article likes" ON "article_likes" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can delete own article likes" ON "article_likes" AS PERMISSIVE FOR DELETE TO "authenticated" USING (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can delete own articles" ON "articles" AS PERMISSIVE FOR DELETE TO "authenticated" USING (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "anyone can select comments" ON "comments" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can insert comments" ON "comments" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can update own comments" ON "comments" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can delete own comments" ON "comments" AS PERMISSIVE FOR DELETE TO "authenticated" USING (user_id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can select profiles" ON "profiles" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "authenticated can insert own profiles" ON "profiles" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can update own profiles" ON "profiles" AS PERMISSIVE FOR UPDATE TO "authenticated" USING (id = auth.uid()) WITH CHECK (id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can delete own profiles" ON "profiles" AS PERMISSIVE FOR DELETE TO "authenticated" USING (id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can select own reports" ON "reports" AS PERMISSIVE FOR SELECT TO "authenticated" USING (reporter_id = auth.uid());--> statement-breakpoint
CREATE POLICY "authenticated can insert reports" ON "reports" AS PERMISSIVE FOR INSERT TO "authenticated" WITH CHECK (reporter_id = auth.uid());--> statement-breakpoint
ALTER POLICY "authenticated can insert articles" ON "articles" TO authenticated WITH CHECK (user_id = auth.uid());