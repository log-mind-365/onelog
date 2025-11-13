CREATE
policy "anyone can select avatars"
ON storage.objects
FOR
SELECT
    TO PUBLIC
    USING (
    bucket_id = 'avatars'
    );

CREATE
policy "authenticated can insert own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(NAME))[1] = auth.uid()::text
  AND storage.extension(NAME) IN ('jpg', 'jpeg', 'png')
);

CREATE
policy "authenticated can delete own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(NAME))[1] = auth.uid()::text
);

CREATE policy "authenticated can upsert own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
    bucket_id = 'avatars'
    AND (storage.foldername(NAME))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(NAME))[1] = auth.uid()::text
    AND storage.extension(NAME) IN ('jpg', 'jpeg', 'png')
    )