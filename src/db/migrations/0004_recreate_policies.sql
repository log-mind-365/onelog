-- Custom SQL migration file, put your code below! --
-- Drop existing policies if any (중복 방지)
DROP POLICY IF EXISTS "anyone can select public articles" ON articles;
DROP POLICY IF EXISTS "authenticated can select own articles" ON articles;
DROP POLICY IF EXISTS "authenticated can insert articles" ON articles;
DROP POLICY IF EXISTS "authenticated can update own articles" ON articles;
DROP POLICY IF EXISTS "authenticated can delete own articles" ON articles;

-- Ensure RLS is enabled
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "anyone can select public articles"
ON articles FOR SELECT TO public
                           USING (access_type = 'public');

CREATE POLICY "authenticated can select own articles"
ON articles FOR SELECT TO authenticated
                           USING (user_id = auth.uid());

CREATE POLICY "authenticated can insert articles"
ON articles FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "authenticated can update own articles"
ON articles FOR UPDATE TO authenticated
                                  USING (user_id = auth.uid())
                WITH CHECK (user_id = auth.uid());

CREATE POLICY "authenticated can delete own articles"
ON articles FOR DELETE TO authenticated
USING (user_id = auth.uid());